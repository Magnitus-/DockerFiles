import os
import subprocess

TEMP_CONFIG_FILE = os.environ.get("TEMP_CONFIG_FILE", "/var/tmp/openssl.cnf")
TEMP_SAN_FILE = os.environ.get("TEMP_SAN_FILE", "/var/tmp/san.cnf")

fileTypes = {
    'key_file': {'extension': '.key', 'environment_variable': 'KEY_FILE'},
    'csr_file': {'extension': '.csr', 'environment_variable': 'CSR_FILE'},
    'certificate_file': {'extension': '.crt', 'environment_variable': 'CERTIFICATE_FILE'}
}

def getPassword(prefix):
    if os.environ.get(prefix + '_PASSWORD') != None:
        return 'pass:' + os.environ.get(prefix + '_PASSWORD')
    elif os.environ.get(prefix + '_PASSWORD_FILE') != None:
        return 'file:' + os.environ.get(prefix + '_PASSWORD_FILE')
    else:
        return None

def getSerializationFile():
    if os.environ.get('CA_SERIALIZATION_FILE') != None:
        return os.environ.get('CA_SERIALIZATION_FILE')
    elif os.environ.get('CA_CERTIFICATE_FILE') != None:
        caCertificateFile = os.environ.get('CA_CERTIFICATE_FILE')
        baseName = os.path.splitext(os.path.basename(caCertificateFile))[0]
        dirName = os.path.dirname(caCertificateFile)
        fullFilename = os.path.join(dirName, baseName + '.srl')
        if os.path.isfile(fullFilename):
            return fullFilename

    return None

def getEnv():
    env = {}
    env['domains'] = os.environ.get('DOMAINS').split(';')

    for fileType in ['key_file', 'csr_file', 'certificate_file']:
        envVar = fileTypes[fileType]['environment_variable']
        ext = fileTypes[fileType]['environment_variable']
        if os.environ.get(envVar) == None:
            env[fileType] = 'domain' + ext
        else:
            env[fileType] = os.environ.get(envVar) if os.environ.get(envVar) != '' else env['domains'][0] + ext
        env[fileType] = os.path.join(os.environ.get('OUTPUT_DIR'), env[fileType])

    env['password'] = getPassword('KEY')

    if os.environ.get('CA_KEY_FILE') != None:
        env['ca_key_file'] = os.environ.get('CA_KEY_FILE')
        env['ca_certificate_file'] = os.environ.get('CA_CERTIFICATE_FILE')
        env['ca_password'] = getPassword('CA_KEY')
        env['ca_serialization_file'] = getSerializationFile()
    else:
        env['ca_key_file'] = None
        env['ca_certificate_file'] = None
        env['ca_password'] = None

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

def getGenerateKeyCmd(env):
    generateKeyCmd = ["openssl", "genrsa",
                      "-out", env['key_file']]

    if env['password'] != None:
        generateKeyCmd += ["-" + env['key_encryption_cypher'],
                           "-passout", env['password']]

    generateKeyCmd += [env['key_bits']]

    return generateKeyCmd

def getGenerateCsrCmd(env):
    generateCsrCmd = ["openssl", "req", "-new",
                      "-key", env['key_file'],
                      "-out", env['csr_file'],
                      "-subj", "\"" + env['subj'] + "\"",
                      "-extensions", "SAN",
                      "-reqexts", "SAN",
                      "-config", TEMP_CONFIG_FILE]

    if env['password'] != None:
        generateCsrCmd += ["-passin", env['password']]

    return generateCsrCmd

def getGenerateCrtCmd(env):
    generateCrtCmd = ["openssl", "x509",
                      "-in", env['csr_file'],
                      "-req", "-days", env['certificate_duration'],
                      "-out", env['certificate_file'],
                      "-extfile", TEMP_SAN_FILE]

    if env['ca_key_file'] != None:
        generateCrtCmd += ["-CA", env['ca_certificate_file'],
                           "-CAKey", env['ca_key_file']]
        if env['ca_password'] != None:
            generateCrtCmd += ["-passin", env['ca_password']]

        if env['ca_serialization_file'] != None:
            generateCrtCmd += ["-CAserial", env['ca_serialization_file']]
        else:
            generateCrtCmd += ["-CAcreateserial"]
    else:
        generateCrtCmd += ["-signkey", env['key_file']]
        if env['password'] != None:
            generateCrtCmd += ["-passin", env['password']]

    return generateCrtCmd

def getCmds(env):
    cmds = {}
    cmds['generate_key'] = getGenerateKeyCmd(env)
    cmds['generate_csr'] = getGenerateCsrCmd(env)
    cmds['generate_crt'] = getGenerateCrtCmd(env)

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
