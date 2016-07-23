/*
    Performance note: 
    
    This algorithm yields acceptable performance when the number of draws is small compared to the number of balls (ie, small number of collisions in generated results)
                      
    If the number of draws is a significant proportion of the number of balls (ex: 40 picks out of 50), it may be worthwhile to consider sorting an array of balls instead.
    
    Alternatively, you could calculate the number of possible permutations, generate a result at random from 1 to that number and find out the permutation is maps to, but this may not yield a significant performance improvement (generating a random number is pretty fast) and potentially lead to ridiculously large numbers (ex:, 250 ordered balls out of 300 is a lot of permutations)

    A final way, that could generate the fastest performances at the cost of memory, if you want to crunch a lot of results with the same set, is to pre-compute a matrix of conditional probabilites.

    Again, while exploring all those possibilities would make an interesting engineering exercise, quickly finding a simple solution with acceptable performance characteristics for the kind of problems we are trying to solve is paramount.    
*/

module.exports = function(balls, draws) {
    if((!balls) || balls <= 0)
    {
        throw new Error("draw:ballsBadValue");
    }
    
    if((!draws) || draws <= 0 || draws > balls)
    {
        throw new Error("draw:drawsBadValue");
    }
    
    var results = [];
    
    while(draws > 0)
    {
        var result = Math.floor((Math.random() * balls) + 1);
        if(!results.some(function(element) {
           return element == result;
        }))
        {
            results.push(result);
            draws--;
        }
    }
    
    return results;
}