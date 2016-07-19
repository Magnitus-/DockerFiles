var React = require('react');
var ReactDOM = require('react-dom');

var DrawFeedback = require('draw-feedback');

module.exports = React.createClass({
    handleSubmit: function(event) {
        //Sometimes, it's extra work to prevent built-in browser defaults (in this case, reloading the page), but 
        //I think using the right semantic html tags to describe gui structure makes the application easier to understand
        event.preventDefault();
        this.props.initiateDraw();
    },
    render: function() {
        var self = this;
        return (
            <section className='draw'>
                {function() {
                    if(this.props.winners === null)
                    {
                        return (
                            <form id='drawForm' onSubmit={self.handleSubmit}>
                                <h3>Press Button For a Draw</h3>
                                <p>Pot amount: {this.props.potAmount}</p>
                                <input type='submit' onClick={this.handleClick} value='Draw' />
                            </form>
                        );
                    }
                    else
                    {
                        return (<DrawFeedback clearParticipants={this.props.clearParticipants} winners={this.props.winners}></DrawFeedback>);
                    }
                }.call(this)}
            </section>
        );
    }
});