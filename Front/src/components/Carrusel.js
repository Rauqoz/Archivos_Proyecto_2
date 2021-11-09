import React, { Fragment , useState } from 'react'
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
          //caption: 'Slide 1',
          key: 1,
          src: 'https://cdn.pixabay.com/photo/2017/03/05/13/30/hallowen-2118650_960_720.jpg'
        },
        {
          altText: 'Slide 2',
          //caption: 'Slide 2',
          key: 2,
          src: 'https://cdn.pixabay.com/photo/2014/05/05/19/52/charcuterie-338498_960_720.jpg'
        },
        {
          altText: 'Slide 3',
          //caption: 'Slide 3',
          key: 3,
          src: 'https://cdn.pixabay.com/photo/2017/11/07/20/43/christmas-tree-2928142_960_720.jpg'
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
                <img src={item.src} width="1920" height="1080" alt={item.altText}  />
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
            <h1>Puestos de la Empresa</h1>
        </Fragment >
    );
    
}

export default Carrusel
