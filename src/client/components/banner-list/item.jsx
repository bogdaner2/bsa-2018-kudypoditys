import React, { Component, Fragment, connect } from 'react';
import { Card, Container, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import './index.scss';
import tag from 'client/components/banner-list/img/tag.svg';
import shortParagraphImg from './img/short-paragraph.png';

export class Banner extends Component {

    handleClick(cityInfo) {
        this.props.onClick(cityInfo)
    }
    render() {
        const { cityInfo } = this.props;
        const imgStyles = (url) => ({
            background: `url(${url})`,
            backgroundSize: 'cover',
        });
        const val = Number(cityInfo.avgPrice).toFixed(0)

        return (

            cityInfo ?
                < Container onClick={() => this.handleClick(cityInfo)} className="banner transition">

                    <Card.Content className="banner__content" style={imgStyles(cityInfo.pictureUrl)}>
                        <Card.Header className="banner__title">
                            {cityInfo.city}
                        </Card.Header>
                        <Card.Meta>
                            <h5 className="banner__subtitle">{Intl.NumberFormat('en-US').format(cityInfo.properties)}   properties</h5>
                        </Card.Meta>
                        <div className="banner__rectangle">
                            <div className="banner___flag" style={imgStyles(cityInfo.flagUrl)} />
                            <Card.Description className="banner__avgprice">
                                <span>Average price</span>
                                <span> US$  {Intl.NumberFormat('en-US').format(cityInfo.avgPrice)}</span>
                            </Card.Description>
                        </div>
                    </Card.Content>

                </Container >
                : <Fragment>
                    <Image src={shortParagraphImg} className="shortParagraphImg" />
                    <Image src={shortParagraphImg} className="shortParagraphImg" />
                </Fragment>

        );

    }
}

Banner.propTypes = {
    cityInfo: PropTypes.shape({
        id: PropTypes.number.isRequired,
        city: PropTypes.string.isRequired,
        flagUrl: PropTypes.string.isRequired,
        properties: PropTypes.number.isRequired,
        avgPrice: PropTypes.number.isRequired,
        pictureUrl: PropTypes.string.isRequired
    }),

    onCardClick: PropTypes.func
};

