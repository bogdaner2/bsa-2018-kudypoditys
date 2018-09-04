import React from "react";
import { Modal } from "semantic-ui-react";

import "./index.scss";

export default class ModalComponent extends React.Component {
    render() {
        const {header, trigger, fullScreen, children, onClose, className, open} = this.props;

        return (
            <Modal
                trigger={trigger}
                closeIcon={fullScreen}
                className={fullScreen ? "fullScreen" : className}
                // onClose={onClose ? onClose : () => {
                // }}
                open={open}
                onClose={this.close}
            >
                {header ? (
                    <Modal.Header>{header}</Modal.Header>
                ) : (
                    <React.Fragment />
                )}
                <Modal.Content>{children}</Modal.Content>
            </Modal>
        );
    }
}
