import React from "react";
import {
    Container,
    Header,
    Grid,
    Image,
    Button,
    Icon,
    Table,
    Divider
} from "semantic-ui-react";
import { Slider } from "../slider";
import moment from "moment";
import "./booking-page.scss";
import MapWidgetModal from "client/components/map-widget-modal";

export class BookingPage extends React.Component {
    cancelBooking = (event, booking) => {
        this.props.cancelBooking(booking);
    };
    render() {
        const { booking, images } = this.props;
        const { orderCode } = this.props.booking;
        const { room } = booking;
        const { property } = room;
        const dateIn = new Date(booking.dateIn),
            dateOut = new Date(booking.dateOut);
        const start = moment(dateIn);
        const end = moment(dateOut);
        const duration = moment.duration(end.diff(start));
        const days = Math.round(duration.asDays());
        const price = Number(room.price) * days;
        return (
            <Container>
                <a
                    onClick={this.props.backToAllBookings}
                    style={{
                        cursor: "pointer",
                        color: "#465672"
                    }}
                >
                    <span>
                        <Icon name="triangle left" />
                        Back to all bookings
                    </span>
                </a>
                <Divider />
                <div className="property-images">
                    <Slider pics={images} />
                </div>
                <Divider />
                <div className="booking-page-top-section">
                    <Table collapsing celled className="booking-info">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell
                                    colSpan={2}
                                    textAlign="center"
                                >
                                    Booking Info
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>
                                    <Icon name="bed" />
                                    Room
                                </Table.Cell>
                                <Table.Cell>{room.roomType.name}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Icon name="calendar alternate" />
                                    Check-in
                                </Table.Cell>
                                <Table.Cell>
                                    {moment(booking.dateIn).format(
                                        "ddd, MMMM DD"
                                    )}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Icon name="calendar alternate" />
                                    Check-out
                                </Table.Cell>
                                <Table.Cell>
                                    {moment(booking.dateOut).format(
                                        "ddd, MMMM DD"
                                    )}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Icon name="dollar" />
                                    Total
                                </Table.Cell>
                                <Table.Cell>{price} USD</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Icon name="barcode" />
                                    Order code
                                </Table.Cell>
                                <Table.Cell>{orderCode}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell colSpan="2">
                                    <Button
                                        negative
                                        fluid
                                        onClick={event =>
                                            this.cancelBooking(event, booking)
                                        }
                                    >
                                        Cancel your booking
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                    <div className="property-info">
                        <Header
                            textAlign="center"
                            className="property-name"
                            as="h2"
                        >
                            <a style={{ color: "#465672", cursor: "pointer" }}>
                                {room.property.name}
                            </a>
                        </Header>
                        <p>
                            <Icon name="map marker alternate" />
                            {room.property.address}
                            {" –"}

                            {console.log(booking.room.property.coordinates)}
                            <MapWidgetModal
                                properties={[
                                    {
                                        price: room.price,
                                        name: property.name,
                                        coordinates: property.coordinates,
                                        imageSrc: property.images[0].url,
                                        address: property.address,
                                        rating: property.rating
                                    }
                                ]}
                                startPosition={{
                                    latitude: property.coordinates.lat,
                                    longitude: property.coordinates.lng
                                }}
                                zoom={13}
                                controlEnable={true}
                                buttonClass={"searchMapButton"}
                            />
                        </p>
                        <p>
                            <Icon name="phone" />
                            {room.property.contactPhone}
                        </p>
                        {/* <p>{room.property.description}</p> */}
                    </div>
                </div>
            </Container>
        );
    }
}
