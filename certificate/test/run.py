import unittest, shutil, os, subprocess, hashlib, re

class TestCAWithPassword(unittest.TestCase):
    def setUp(self):
        shutil.copytree(os.path.join('..', 'example', 'ca-signed-with-password'), os.path.join('.', 'certificate'))
        subprocess.check_call("docker-compose up ca-certificate-generator", shell=True, cwd=os.path.join('.', 'certificate'))
        subprocess.check_call("docker-compose up certificate-generator", shell=True, cwd=os.path.join('.', 'certificate'))

    def tearDown(self):
        subprocess.check_call("docker-compose down", shell=True, cwd=os.path.join('.', 'certificate'))
        shutil.rmtree(os.path.join('.', 'certificate'))

    def test_generated_files_present(self):
        self.assertTrue(os.path.isfile(os.path.join('.', 'certificate', 'ca.crt')))
        self.assertTrue(os.path.isfile(os.path.join('.', 'certificate', 'ca.csr')))
        self.assertTrue(os.path.isfile(os.path.join('.', 'certificate', 'ca.key')))
        self.assertTrue(os.path.isfile(os.path.join('.', 'certificate', 'ca.srl')))
        self.assertTrue(os.path.isfile(os.path.join('.', 'certificate', 'certificate.crt')))
        self.assertTrue(os.path.isfile(os.path.join('.', 'certificate', 'certificate.csr')))
        self.assertTrue(os.path.isfile(os.path.join('.', 'certificate', 'certificate.key')))

    #Technically not a memory efficient test for md5 checksum, but who cares in a test scenario
    #when the file is small?
    def test_certificate_regeneration_works(self):
        previousSrlHash = hashlib.md5(open(os.path.join('.', 'certificate', 'ca.srl'), 'rb').read()).hexdigest()
        subprocess.check_call("docker-compose up certificate-generator", shell=True, cwd=os.path.join('.', 'certificate'))
        currentSrlHash = hashlib.md5(open(os.path.join('.', 'certificate', 'ca.srl'), 'rb').read()).hexdigest()
        self.assertNotEqual(previousSrlHash, currentSrlHash)

    def test_certificate_is_valid(self):
        output = subprocess.check_output("openssl verify -CAfile ca.crt certificate.crt", shell=True, cwd=os.path.join('.', 'certificate'))
        self.assertEqual(output.strip(), "certificate.crt: OK")

    def test_certificate_has_correct_values(self):
        output = subprocess.check_output("openssl x509 -in certificate.crt -text -noout", shell=True, cwd=os.path.join('.', 'certificate'))
        self.assertIsNotNone(re.search('Issuer: C=CA, ST=Quebec, L=Montreal, O=Any, OU=IT, CN=dev.cadomain.com/emailAddress=email@cadomain.com', output))
        self.assertIsNotNone(re.search('Subject: C=CA, ST=Quebec, L=Montreal, O=Any, OU=IT, CN=dev.mydomain.com/emailAddress=email@mydomain.com', output))
        self.assertIsNotNone(re.search('Public-Key: \(2048 bit\)', output))
        self.assertIsNotNone(re.search('Subject Alternative Name:', output))
        self.assertIsNotNone(re.search('DNS:dev.mydomain.com, DNS:test.mydomain.com', output))

if __name__ == '__main__':
    unittest.main()
