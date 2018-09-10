import React, { Fragment } from "react";
import "./index.scss";

import { getPropertyStatus } from "client/helpers/avgReviewRating";
import { Icon, Popup } from "semantic-ui-react";
import RatingBar from "./ratingBar";

class RatingBlock extends React.Component {
    render() {
        const { avgPropRating, reviewsCount, property } = this.props;

        const ratingStatus = getPropertyStatus(avgPropRating);
            console.log(avgPropRating)
        return (
            <div
                className="rating_block"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <div
                    className="rating_status"
                    style={{
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        padding: "0 10px 0 0"
                    }}
                >
                    <div className="ratingName"> {ratingStatus}</div>

                    <span className="reviewsNumber">
                        {reviewsCount} reviews
                    </span>
                </div>
                    <Popup
                        style={{
                            overflow: "hidden",
                            opacity: "1",
                            width: 250,

                        }}
                        trigger={

                            <div className="rating_num" style = {{
                                width: 70,
                                visibility:

                                    avgPropRating === 0 ? "hidden" : "block"

                            }}> {avgPropRating}
                            </div>
                        }
                        content={ <div style={{padding: 10} }>  <RatingBar property={property} /> </div>}
                        hoverable
                        basic
                        hideOnScroll
                        position='bottom center'
                    />
            </div>
        );
    }
}

export default RatingBlock;
