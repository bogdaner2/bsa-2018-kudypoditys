import React, {Fragment} from "react";
import {Form} from "semantic-ui-react";
import {ButtonsValues, options} from "./config";
import {mapStateToProps, mapDispatchToProps} from './container';
import {connect} from 'react-redux';


export class Draw extends React.Component {

    handleClick = (event, value) => {
        this.props.onSelectTime(value.value, value.type);

    };

    render() {

        const
            activeO = this.props.activeO,
            type = this.props.type;

        const Buttons = ButtonsValues.map(button => (
                <Form.Button
                    key={button + 1}
                    basic
                    fluid
                    content={button}
                    onClick={this.handleClick}
                    value={button}
                    active={button === activeO}
                    type={type}
                />
            )
        );

        return (
            <Fragment>
                {Buttons}
                <Form.Select
                    basic
                    placeholder='Other Time'
                    options={options}
                    onChange={this.handleClick}
                    type={type}

                />
            </Fragment>
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Draw);