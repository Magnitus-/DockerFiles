function compare(a, b) 
{
    if(a.length < b.length)
    {
        return -1;
    }

    if(a.length > b.length)
    {
        return 1;
    }

    return 0;
}

module.exports = function(array) {
    return array.sort(compare);
}

