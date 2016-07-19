var React = require('react');
var ReactDOM = require('react-dom');

function getRankingSuffix(rank)
{
    if(rank == 1)
    {
        return 'rst';
    }
    else if(rank == 2)
    {
        return 'nd';
    }
    else if(rank == 3)
    {
        return 'rd';
    }
    else
    {
        return 'th';
    }
}

var WinnersList = React.createClass({
    render: function() {
        return (
            <ul>
                {this.props.winners.map(function(winner, index){
                    if(winner === null)
                    {
                        return (
                                   <li>
                                       <span>{(index+1)+getRankingSuffix(index+1)+' ball'}</span>
                                       <span>{'no winner'}</span>
                                   </li>
                               );
                    }
                    else
                    {
                        return (
                                   <li>
                                       <span>{(index+1)+getRankingSuffix(index+1)+' ball'}</span>
                                       <span>{winner['name']+': '+winner['award']+ '$'}</span>
                                   </li>
                               );
                    }
                })}
            </ul>
        );
    }
});


module.exports = React.createClass({
    handleClick: function(event) {
        this.props.clearParticipants();
    },
    render: function() {
        var allNull = this.props.winners.every(function(elem) {return elem === null});
        var content = [];
        content.push(<h3>Winners</h3>);
        if(allNull)
        {
            content.push(<p>No winners this round. Better luck next time...</p>);
        }
        else
        {
            content.push(<WinnersList winners={this.props.winners}></WinnersList>);
        }
        return (
            
            <section className='draw-feedback' onClick={this.handleClick}>{content}</section>
        );
    }
});