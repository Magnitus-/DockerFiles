const isPrime = require('is-prime');

exports.main = {
    main: function(test) {
        test.expect(2);
        test.ok(isPrime(1) && isPrime(2) && isPrime(3) && isPrime(5) && isPrime(7) && isPrime(11) && isPrime(13) && isPrime(17) && isPrime(19) && isPrime(23), "Assert that library can detect primes.");
        test.ok((!isPrime(4)) && (!isPrime(6)) && (!isPrime(8)) && (!isPrime(9)) && (!isPrime(10)) && (!isPrime(12)) && (!isPrime(14)) && (!isPrime(15)), "Assert that library can identify non-primes.");
        test.done();
    }
}
