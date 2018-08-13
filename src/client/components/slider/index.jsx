import SliderSlick from 'react-slick';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import 'slick-carousel/slick/slick.css';
import './index.scss';

import { Container, Button, Image, Icon } from 'semantic-ui-react';

export class Slider extends Component {

    pics = [
        'https://picsum.photos/600/302',
        'https://picsum.photos/600/303',
        'https://picsum.photos/600/304',
        'https://picsum.photos/600/305',
        'https://picsum.photos/600/306'
    ];
    picsThumbnails = (pics) => {
        return (
            <ul>
                {
                    pics.map((item, i) => (
                        <li key={i}>
                            <button
                                className={i === this.slideIndex ? 'slider-c-button-active' : ''}
                                onMouseMove={() => this.slider.slickGoTo(i)}
                                onClick={() => this.slider.slickGoTo(i)}
                            >
                                <Image
                                    src={item}
                                    size='mini'
                                />
                            </button>
                        </li>
                    ))
                }
            </ul>
        )
    };
    settings = {
        dots: true,
        speed: 300,
        fade: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        accessibility: false,
        appendDots: () => this.picsThumbnails(this.pics),
        beforeChange: (curr, next) => this.slideIndex = next
    };

    render() {
        this.slideIndex = this.props.slideIndex || 0;
        return (
            <Container fluid className='slider-c-wrapper'>
                <Button
                    className='slider-c-button slider-c-prev-button'
                    onClick={() => this.slider.slickPrev()}
                >
                    <Icon name='arrow alternate circle left' size='large'/>
                </Button>
                    <SliderSlick ref={slider => (this.slider = slider)} {...this.settings}>
                        {this.pics.map((item, i) => <Image className='slider-c-image' src={item} key={i}/>)}
                    </SliderSlick>
                <Button
                    className='slider-c-button slider-c-next-button'
                    onClick={() => this.slider.slickNext()}
                >
                    <Icon name='arrow alternate circle right' size='large'/>
                </Button>
            </Container>
        )
    }
}

Slider.propTypes = {
    pics: PropTypes.array,
    slideIndex: PropTypes.number
};

export default Slider;