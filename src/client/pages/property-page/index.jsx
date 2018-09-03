import React from "react";
import "./index.scss";
import {
    Divider,
    Container,
    List,
    Header,
    Icon,
    Sidebar
} from "semantic-ui-react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "./container";
import Search from "client/components/search";
import AppHeader from "client/components/header";
import AvailabilityPanel from "client/components/availability-panel";
import Slider from "client/components/slider";
import PropertyDescription from "client/components/property-description";
import { PropertySummary } from "client/components/property-summary";
import { NavigationBar } from "client/components/navigation-bar";
import BasicMapWidget from "client/components/basic-map-widget";
import RoomsSummaryTable from "client/components/rooms-summary-table";
import Modal from "../../components/modal";
import BookingForm from "../../components/booking-form";
import ReactDOM from "react-dom";
import HouseRules from "./rules";
import PaymentMethods from "./payment";

export class PropertyPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reviewsVisible: false
        };
    }

    componentWillMount() {
        this.props.getProperty(this.props.match.params.id);
        this.props.getBookings();
    }

    getImagesArray(propertyImages) {
        let images = [];
        for (let i = 0; i < propertyImages.length; i++) {
            images.push(propertyImages[i].url);
        }
        return images;
    }

    scrollTo = targetRef => {
        const node = ReactDOM.findDOMNode(this.refs[targetRef]);
        node.scrollIntoView();
    };

    toggleReviews = () => {
        this.setState({ reviewsVisible: !this.state.reviewsVisible });
    };

    hideReviews = () => {
        this.setState({ reviewsVisible: false });
    };

    render() {
        const { property, user } = this.props;
        const { reviewsVisible } = this.state;
        const dividerStyle = {
            color: "#465672",
            borderTop: "1px solid #46567215",
            borderBottom: "1px solid #465672"
        };
        const headerStyle = {
            color: "#465672",
            cursor: "default"
        };

        if (!property) return null;

        const pics = this.getImagesArray(property.images);
        return (
            <div className="mock">
                <AppHeader showSearch={true} />

                <Sidebar
                    onHide={this.hideReviews}
                    visible={reviewsVisible}
                    animation="overlay"
                    direction="right"
                    width="very wide"
                    vertical
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            height: "100%",
                            width: "100%"
                        }}
                    >
                        <h1>Hello reviews</h1>
                    </div>
                </Sidebar>
                <Sidebar.Pusher>
                    <div className="property-page__wrapper">
                        <div text className="property-page__wrapper-left_side">
                            <BasicMapWidget
                                key="BasicMapWidget"
                                coordinates={property.coordinates}
                                controlEnable={false}
                                rounded
                                centered
                            />
                            {user ? (
                                <Modal
                                    trigger={
                                        <div
                                            className="book-btn"
                                            style={{ height: "33px" }}
                                        >
                                            <button>Book now</button>
                                            <div
                                                className="book-icon"
                                                style={{
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <Icon
                                                    name="bookmark"
                                                    size="large"
                                                />
                                            </div>
                                        </div>
                                    }
                                    onClose={this.props.clearBookingForm}
                                >
                                    <BookingForm
                                        rooms={property.rooms}
                                        paymentTypes={property.paymentTypes}
                                    />
                                </Modal>
                            ) : null}
                        </div>

                        <Container
                            text
                            className="property-page__wrapper-right_side"
                        >
                            <NavigationBar
                                reviewsCount={property.reviews.length}
                                facilitiesClick={() => {
                                    this.scrollTo("facilitiesRef");
                                }}
                                infoClick={() => {
                                    this.scrollTo("roomsRef");
                                }}
                                rulesClick={() => {
                                    this.scrollTo("houseRuleRef");
                                }}
                                reviewsClick={() => {
                                    this.toggleReviews();
                                }}
                            />
                            <Divider />
                            <PropertySummary property={property} />
                            <Slider pics={pics} slideIndex={0} />

                            <Divider hidden />
                            <div
                                className="property-page__description"
                                style={{ width: "100%" }}
                            >
                                <PropertyDescription
                                    property={property}
                                    style={{ width: "100%" }}
                                />
                                <Divider style={dividerStyle} />
                                <Container
                                    text
                                    style={{
                                        display: "table",
                                        lineHeight: 1.2
                                    }}
                                >
                                    <div className="facilities-section">
                                        <div ref={"facilitiesRef"}>
                                            <Header as="h2" style={headerStyle}>
                                                Facilities
                                            </Header>
                                            <List>
                                                {property.facilityLists.map(
                                                    (item, i) => {
                                                        return (
                                                            <List.Item>
                                                                <List.Content>
                                                                    <span
                                                                        key={i}
                                                                        style={{
                                                                            marginRight: 10,
                                                                            marginBottom: 10,
                                                                            fontSize: 18,
                                                                            lineHeight: 1.2,
                                                                            color:
                                                                                "rgb(166,174,188)"
                                                                        }}
                                                                    >
                                                                        {
                                                                            item
                                                                                .facility
                                                                                .name
                                                                        }
                                                                    </span>
                                                                </List.Content>
                                                            </List.Item>
                                                        );
                                                    }
                                                )}
                                            </List>
                                        </div>
                                        <div
                                            className="rules-payment-section"
                                            ref={"houseRuleRef"}
                                        >
                                            <Header as="h2" style={headerStyle}>
                                                Hotel Policy
                                            </Header>
                                            <HouseRules
                                                rules={
                                                    property.accommodationRule
                                                }
                                            />
                                            <Header
                                                as="h2"
                                                style={{ color: "#465672" }}
                                            >
                                                Payment Method
                                            </Header>
                                            <PaymentMethods
                                                paymentTypes={
                                                    property.paymentTypes
                                                }
                                            />
                                        </div>
                                    </div>
                                </Container>
                            </div>

                            <Divider
                                style={{
                                    color: "#465672",
                                    borderTop: "1px solid #46567215",
                                    borderBottom: "1px solid #465672"
                                }}
                            />

                            <AvailabilityPanel style={{ width: "100%" }} />
                            <Divider style={dividerStyle} />
                            <div>
                                <Header
                                    as="h2"
                                    style={{
                                        ...headerStyle,
                                        paddingLeft: "15px"
                                    }}
                                >
                                    Rooms
                                </Header>
                                <RoomsSummaryTable
                                    ref={"roomsRef"}
                                    rooms={property.rooms}
                                />
                            </div>
                            <Divider hidden />
                        </Container>
                    </div>
                </Sidebar.Pusher>
            </div>
        );
    }
}

PropertyPage.propTypes = {};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PropertyPage);
