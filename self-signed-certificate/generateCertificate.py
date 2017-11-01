import os
import subprocess

TEMP_CONFIG_FILE = os.environ.get("TEMP_CONFIG_FILE", "/var/tmp/openssl.cnf")
TEMP_SAN_FILE = os.environ.get("TEMP_SAN_FILE", "/var/tmp/san.cnf")

def getEnv():
    env = {}
    env['domains'] = os.environ.get('DOMAINS').split(';')
    env['key_file'] = os.path.join(os.environ.get('OUTPUT_DIR'), os.environ.get('KEY_FILE') if os.environ.get('KEY_FILE') != '' else env['domains'][0] + '.key')
    env['csr_file'] = os.path.join(os.environ.get('OUTPUT_DIR'), os.environ.get('CSR_FILE') if os.environ.get('CSR_FILE') != '' else env['domains'][0] + '.csr')
    env['certificate_file'] = os.path.join(os.environ.get('OUTPUT_DIR'), os.environ.get('CERTIFICATE_FILE') if os.environ.get('CERTIFICATE_FILE') != '' else env['domains'][0] + '.crt')
    if os.environ.get('KEY_PASSWORD') != None:
        env['password'] = 'pass:' + os.environ.get('KEY_PASSWORD')
    elif os.environ.get('KEY_PASSWORD_FILE') != None:
        env['password'] = 'file:' + os.environ.get('KEY_PASSWORD_FILE')
    else:
        env['password'] = None
    env['san'] = ",".join(["DNS:" + domain for domain in env['domains']])
    env['subj'] = "/C={COUNTRY}/ST={STATE}/L={CITY}/O={ORGANIZATION}/OU={DEPARTMENT}/CN={DOMAIN}/emailAddress={EMAIL}".format(**{
        'COUNTRY': os.environ.get('COUNTRY'),
        'STATE': os.environ.get('STATE'),
        'CITY': os.environ.get('CITY'),
        'ORGANIZATION': os.environ.get('ORGANIZATION'),
        'DEPARTMENT': os.environ.get('DEPARTMENT'),
        'DOMAIN': env['domains'][0],
        'EMAIL': os.environ.get('EMAIL')
    })
    env['key_encryption_cypher'] = os.environ.get('KEY_ENCRYPTION_CYPHER')
    env['certificate_duration'] = os.environ.get('CERTIFICATE_DURATION')
    env['key_bits'] = os.environ.get('KEY_BITS')
    env['output_certificate_info'] = os.environ.get('OUTPUT_CERTIFICATE_INFO') == 'true'
    return env

def getCmds(env):
    cmds = {}
    if env['password'] != None:
        cmds['generate_key'] = ["openssl", "genrsa",
                                "-out", env['key_file'],
                                "-" + env['key_encryption_cypher'],
                                "-passout", env['password'],
                                env['key_bits']]
        cmds['generate_csr'] = ["openssl", "req", "-new",
                                "-key", env['key_file'],
                                "-out", env['csr_file'],
                                "-subj", env['subj'],
                                "-reqexts", "SAN",
                                "-extensions", "SAN",
                                "-config", TEMP_CONFIG_FILE,
                                "-passin", env['password']]
        cmds['generate_crt'] = ["openssl", "x509",
                                "-signkey", env['key_file'],
                                "-in", env['csr_file'],
                                "-req", "-days", env['certificate_duration'],
                                "-out", env['certificate_file'],
                                "-passin", env['password'],
                                "-extfile", TEMP_SAN_FILE]
    else:
        cmds['generate_key'] = ["openssl", "genrsa",
                                "-out", env['key_file'],
                                env['key_bits']]
        cmds['generate_csr'] = ["openssl", "req", "-new",
                                "-key", env['key_file'],
                                "-out", env['csr_file'],
                                "-subj", "\"" + env['subj'] + "\"",
                                "-extensions", "SAN",
                                "-reqexts", "SAN",
                                "-config", TEMP_CONFIG_FILE]
        cmds['generate_crt'] = ["openssl", "x509",
                                "-signkey", env['key_file'],
                                "-in", env['csr_file'],
                                "-req", "-days", env['certificate_duration'],
                                "-out", env['certificate_file'],
                                "-extfile", TEMP_SAN_FILE]

    cmds['view_crt'] = ["openssl", "x509",
                        "-in", env['certificate_file'],
                        "-text", "-noout"]

    return cmds

if __name__ == "__main__":
    env = getEnv()
    cmds = getCmds(env)
    if not os.path.isfile(env['key_file']):
        print subprocess.check_output(" ".join(cmds['generate_key']), shell=True)

    if not os.path.isfile(env['csr_file']):
        with open("/etc/ssl/openssl.cnf", "r") as config_file:
            with open(TEMP_CONFIG_FILE, "w") as temp_config_file:
                config_content = config_file.read()
                temp_config_file.write(config_content.replace("# copy_extensions = copy", "copy_extensions = copy") + "\n[SAN]\nsubjectAltName=\"" + env['san'] + "\"")

        print subprocess.check_output(" ".join(cmds['generate_csr']), shell=True)

    with open(TEMP_SAN_FILE, "w") as temp_san_file:
        temp_san_file.write("subjectAltName=" + env['san'])
    print subprocess.check_output(" ".join(cmds['generate_crt']), shell=True)

    if env['output_certificate_info']:
        print subprocess.check_output(" ".join(cmds['view_crt']), shell=True)
