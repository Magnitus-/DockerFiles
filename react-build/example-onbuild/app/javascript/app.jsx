var React = require('react');
var ReactDOM = require('react-dom');

var pot = require('pot');
var participants = require('participants');
var draw = require('draw');

var Header = require('header');
var RegisterSection = require('register-section');
var DrawSection = require('draw-section');

module.exports = React.createClass({
    addRegistrant: function(name) {
        var hasName = this.participants.getNames().some(function(_name) {
            return _name == name;
        });
        var number = hasName ? -1 : this.participants.add(name);
        var lastRegistrant = {
                                 'name': name,
                                 'number': number,
                                 'visible': true
                             };
        if(!hasName)
        {
            this.pot.add(10);
        }
        this.setState({
            'lastRegistrant': lastRegistrant,
            'potAmount': this.pot.get()
        });
    },
    hideRegistrant: function() {
        var lastRegistrant = this.state.lastRegistrant;
        lastRegistrant.visible = false;
        this.setState({
            'lastRegistrant': lastRegistrant
        });
    },
    initiateDraw: function() {
        var drawResult = this.draw();
        var ranks = this.participants.getRanks(drawResult);
        var winners = ranks.map((function(name, index) {
            if(name === null)
            {
                return null;
            }
            else
            {
                return {'name': name, 'ratio': this.props.winRatios[index]};
            }
        }).bind(this));
        winners = this.pot.award(winners);
        this.setState({
            'winners': winners,
            'potAmount': this.pot.get()
        });
    },
    clearParticipants: function() {
        this.participants = participants(this.props.balls);
        this.setState({
           'lastRegistrant': null,
           'potAmount': this.pot.get(),
           'participants': [],
           'winners': null
        });
    },
    getInitialState: function () {
        this.pot = pot(this.props.initPot);
        this.participants = participants(this.props.balls);
        this.draw = function() {
            return draw(this.props.balls, this.props.draws);
        }
        return {
                   'lastRegistrant': null,
                   'potAmount': this.pot.get(),
                   'participants': [],
                   'winners': null
               };
    },
    render: function () {
        return (
            <section>
                <Header></Header>
                <RegisterSection winners={this.state.winners} lastRegistrant={this.state.lastRegistrant} balls={this.props.balls} participants={this.participants.getNames()} hideRegistrant={this.hideRegistrant} addRegistrant={this.addRegistrant}></RegisterSection>
                <DrawSection initiateDraw={this.initiateDraw} clearParticipants={this.clearParticipants} winners={this.state.winners} potAmount={this.state.potAmount}></DrawSection>
            </section>
        );
    }
});
