import React, {Component,} from "react";
import {Header, Container, Grid, Rail, Sticky, Segment} from 'semantic-ui-react';
import RegistrationForm from './registeredForm';
import {connect} from "react-redux";
import {mapStateToProps, mapDispatchToProps} from "./container";


class TabRegistration extends Component {
    handleChange = (e,  name, value ) => {

        console.log( value.values)
        // console.log( e)
        this.props.updateTab(value.values);
    };
    handleProceed = () => {


        this.props.updateTab({
            activeIndex: 1
        });

    };
    render() {
        const {userName} = this.props;
        return (
            <Grid width={13}>
                <Grid.Column width={10}>
                    <Container>
                        <Header as='h2'>Welcome {userName}!</Header>
                        <RegistrationForm onSubmit={this.handleProceed} onChange={this.handleChange}/>
                    </Container>
                </Grid.Column>
            </Grid>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TabRegistration);