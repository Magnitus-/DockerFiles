import os
import subprocess

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
    env['san'] = ''
    for index, domain in enumerate(env['domains'], 0):
        coma = '' if index == 0 else ','
        env['san'] = env['san'] + 'DNS:' + domain + coma
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
    if env['password'] == None:
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
                                "-config", "<(cat /etc/ssl/openssl.cnf <(printf \"\\n[SAN]\\nsubjectAltName=" + env['san'] + "\"))",
                                "-passin", env['password']]
        cmds['generate_crt'] = ["openssl", "x509",
                                "-signkey", env['key_file'],
                                "-in", env['csr_file'],
                                "-req", "-days", env['certificate_duration'],
                                "-out", env['certificate_file'],
                                "-passin", env['password']]
    else:
        cmds['generate_key'] = ["openssl", "genrsa",
                                "-out", env['key_file'],
                                env['key_bits']]
        cmds['generate_csr'] = ["openssl", "req", "-new",
                                "-key", env['key_file'],
                                "-out", env['csr_file'],
                                "-subj", env['subj'],
                                "-extensions", "SAN",
                                "-reqexts", "SAN",
                                "-config", "<(cat /etc/ssl/openssl.cnf <(printf \"\\n[SAN]\\nsubjectAltName=" + env['san'] + "\"))"]
        cmds['generate_crt'] = ["openssl", "x509",
                                "-signkey", env['key_file'],
                                "-in", env['csr_file'],
                                "-req", "-days", env['certificate_duration'],
                                "-out", env['certificate_file']]

    cmds['view_crt'] = ["openssl", "x509",
                        "-in", env['certificate_file'],
                        "-text", "-noout"]

    return cmds

if __name__ == "__main__":
    env = getEnv()
    print env
    cmds = getCmds(env)
    print cmds
    if not os.path.isfile(env['key_file']):
        print "one"
        print subprocess.check_output(" ".join(cmds['generate_key']), shell=True)

    if not os.path.isfile(env['csr_file']):
        print "two"
        print subprocess.check_output(" ".join(cmds['generate_csr']), shell=True)

    subprocess.check_output(" ".join(cmds['generate_crt']), shell=True)

    if env['output_certificate_info']:
        print subprocess.check_output(" ".join(cmds['view_crt']), shell=True)
