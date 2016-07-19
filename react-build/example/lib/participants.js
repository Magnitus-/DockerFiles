/*
Design notes: Idem what was written in pot for class design

Also, while it would have been more intuitive to map the participants as a {'name': number, ...} structure, 
the {'number': 'name', ...} structure fits the access pattern of the class better. 
*/

function participants(balls)
{
    if((!balls) || balls <= 0)
    {
        throw new Error("participants.constructor:ballsBadValue");
    }
    
    //Classical pattern to save end-user of the api from having to use the new operator
    if(this instanceof participants)
    {
        this.balls = balls;
        this.participants = {};
        this.names = []; //Member to efficiently test new names against existing ones
    }
    else
    {
        return new participants(balls);
    }
}

participants.prototype.add = function(name) {
    if(Object.keys(this.participants).length == this.balls)
    {
        throw new Error("participants.add:full");
    }
    
    if(name === "" || name === undefined || name === null)
    {
        throw new Error("participants.add:badName");
    }
    
    if(this.names.some(function(_name) {
        return _name == name;
    }))
    {
        throw new Error("participants.add:nameExists");
    }
    else
    {
        this.names.push(name);
    }
    
    /*Map the available values left to a range.
      Makes traversal slower when almost no values are taken, but greatly improves performance 
      when all balls are almost taken (ex: 45 balls out of 50). Performance could be improved further 
      by keeping track of the mapping and updating it as we insert values. */
    var range = this.balls - Object.keys(this.participants).length;
    var result = Math.floor((Math.random() * range) + 1);
    
    var index = 1;
    while(true)
    {
        if(this.participants[index] === undefined)
        {
            if(result == 1)
            {
                this.participants[index] = name;
                break;
            }
            else
            {
                result--;
            }
        }
        index++;
    }
    
    return index;
}

participants.prototype.getNames = function() {
    return this.names;
}

participants.prototype.getRanks = function(draws) {
    var result = [];
    draws.forEach((function(draw) {
        var participant = this.participants[draw];
        participant = participant === undefined ? null : participant;
        result.push(participant);
    }).bind(this));
    return result;
}

participants.prototype.getWinnings = function(ratios) {
    var result = {};
    for(key in ratios)
    {
        if(this.participants[key] !== undefined)
        {
            result[this.participants[key]] = ratios[key];
        }
    }
    
    return result;
}

module.exports = participants;