/*
Design note 1:
I first thought about implementing the whole pot state directly inside the module...
ie: var pot = 0; <method definitions>; module.exports = {'add': add, 'award': award};
But then, it occured to me that the module would be more extensible if the pot was not a singleton.,

Design note 2:
At first, I though about returning all the methods in the constructor with the pot amount as a shared closure.
In the interest of a slight increase in memory efficiency, I opted for making them prototype properties instead and manipulate the object state.
*/

function properRatio(ratio)
{
    return ratio >= 0 && ratio <= 1.0;
}

function pot(startingAmount)
{
    if(startingAmount < 0)
    {
        throw new Error("pot.constructor:startingAmountNegative");
    }
    
    //Classical pattern to save end-user of the api from having to use the new operator
    if(this instanceof pot)
    {
        this.amount = startingAmount;
    }
    else
    {
        return new pot(startingAmount);
    }
}

pot.prototype.add = function(amount) {
    if(amount < 0)
    {
        throw new Error("pot.add:amountNegative");
    }
    
    this.amount += amount;
};

pot.prototype.award = function(ratios) {
    //temporarily copy amount locality to easily void the entire operation if argument is bad and exception is thrown
    var amount = this.amount;
    
    if(typeof(ratios) == typeof({}) && ratios !== null) //mapping of users with ratios
    {
        //Variable to verify that the sum of passed ratios is <= 1.0
        var ratioSum = 0;
        
        if(Array.isArray(ratios))
        {   //Array of ordered {'name: .., 'ratio': ..} objects
            var result = ratios.map((function(user, index) {
                if(user !== null)
                {
                    ratioSum += user['ratio'];
                    var userAward = Math.floor(user['ratio'] * this.amount); //I use this.amount because each ratio is against the full amount, not the remainders :P
                    amount -= userAward;
                    return {'name': user['name'], 'award': userAward};
                }
                else
                {
                    return null;
                }
            }).bind(this));
        }
        else
        {   //object of unordered user:ratio mappings
            var result = {};
            
            for(user in ratios)
            {
                if(!properRatio(ratios[user]))
                {
                    throw new Error("pot.award:ratioOutOfBound");
                }
                
                ratioSum += ratios[user];
                result[user] = Math.floor(ratios[user] * this.amount); //I use this.amount because each ratio is against the full amount, not the remainders :P
                amount -= result[user];
            }
        }
        
        if(ratioSum > 1.0)
        {
            throw new Error("pot.award:ratiosSumGreaterThan1");
        }
        
        this.amount = amount; //Everything is ok, now we can permanently finalize the operation
        
        return result;
    }
    
    throw new Error("pot.award:ratiosNotObjectOrNull");
};

pot.prototype.get = function() {
    return this.amount;
};

module.exports = pot;