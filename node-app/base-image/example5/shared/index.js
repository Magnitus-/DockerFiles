module.exports = function(candidate) {
    var max = Math.floor(Math.sqrt(candidate));
    var index = 3;
    if(candidate % 2 == 0 && candidate != 2)
    {
        return false;
    }
    while(index <= max)
    {
        if(candidate % index == 0)
        {
            return false;
        }
        index += 2;
    }
    return true;
}
