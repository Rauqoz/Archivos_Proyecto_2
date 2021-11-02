import React, { Fragment, useState } from 'react'
import {
    CarouselControl,
    Carousel,
    CarouselItem,
    CarouselIndicators,
} from 'reactstrap';

const Carrusel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);
  
    // Sample items for Carousel
    const items = [
        {
          altText: 'Slide 1',
          caption: 'Slide 1',
          key: 1,
          src: 'https://picsum.photos/id/123/1200/600'
        },
        {
          altText: 'Slide 2',
          caption: 'Slide 2',
          key: 2,
          src: 'https://picsum.photos/id/456/1200/600'
        },
        {
          altText: 'Slide 3',
          caption: 'Slide 3',
          key: 3,
          src: 'https://picsum.photos/id/678/1200/600'
        }
      ]

    // Items array length
    const itemLength = items.length - 1
  
    // Previous button for Carousel
    const previousButton = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ?
            itemLength : activeIndex - 1;
        setActiveIndex(nextIndex);
    }
  
    // Next button for Carousel
    const nextButton = () => {
        if (animating) return;
        const nextIndex = activeIndex === itemLength ?
            0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    }
  
    // Carousel Item Data
    const carouselItemData = items.map((item) => {
        return (
            <CarouselItem
                key={item.src}
                onExited={() => setAnimating(false)}
                onExiting={() => setAnimating(true)}
            >
                <img src={item.src} alt={item.altText}/>
            </CarouselItem>
        );
    });
  
    return (
        <Fragment >
            <Carousel previous={previousButton} next={nextButton}
                activeIndex={activeIndex}>
                <CarouselIndicators items={items}
                    activeIndex={activeIndex}
                    onClickHandler={(newIndex) => {
                        if (animating) return;
                        setActiveIndex(newIndex);
                    }} />
                {carouselItemData}
                <CarouselControl directionText="Prev"
                    direction="prev" onClickHandler={previousButton} />
                <CarouselControl directionText="Next"
                    direction="next" onClickHandler={nextButton} />
            </Carousel>
        </Fragment >
    );
    
}

export default Carrusel
