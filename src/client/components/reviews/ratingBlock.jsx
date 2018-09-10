import React, { Fragment } from "react";
import "./index.scss";

import {
    getPropertyStatus,
    getPropertyColor
} from "client/helpers/avgReviewRating";
import { Icon, Popup } from "semantic-ui-react";
import RatingBar from "./ratingBar";

class RatingBlock extends React.Component {
    render() {
        const { avgPropRating, reviewsCount, property } = this.props;

        const ratingStatus = getPropertyStatus(avgPropRating);
        const ratingColor = getPropertyColor(avgPropRating);
        console.log(avgPropRating);
        return (
            <div className="rating_block">
                <div
                    className="rating_status"
                    style={{
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        paddingRight: 10
                    }}
                >
                    <div className="ratingName"> {ratingStatus}</div>
                    <br />
                    <span className="reviewsNumber">
                        {reviewsCount} reviews
                    </span>
                </div>
                <Popup
                    style={{
                        overflow: "hidden",
                        opacity: "1",
                        width: 250
                    }}
                    trigger={
                        <div
                            className="rating_num"
                            style={{
                                color: ratingColor,
                                width: 70,
                                visibility:
                                    avgPropRating === 0 ? "hidden" : "block"
                            }}
                        >
                            {" "}
                            {avgPropRating}
                        </div>
                    }
                    content={
                        <div style={{ padding: 10 }}>
                            {" "}
                            <RatingBar property={property} />{" "}
                        </div>
                    }
                    hoverable
                    basic
                    hideOnScroll
                    position="bottom center"
                />
            </div>
        );
    }
}

export default RatingBlock;
