import defaultState from 'client/logic/defaultState';
import { CITY_INFOS_GET,
        CITY_INFOS_GET_SUCCESS,
        CITY_INFOS_GET_FAILD
   } from './actionType';

function cityInfosReducer(state = defaultState, action) {
    switch (action.type) {
        case CITY_INFOS_GET_SUCCESS:
        console.log(action)
        const CITY_INFOS = {
            0:{
                id: 1,
                city: 'Lviv',
                properties: action.payload[0].properties,
                avgPrice: action.payload[0].avgPrice,
                pictureUrl: 'http://www.mgi4ua.com/wp-content/uploads/2017/11/lviv-ukraine.jpg',
                flagUrl: 'http://proudofukraine.com/wp-content/uploads/2015/06/Ukrainian-flag.png'
            },
            1:{
                id: 2,
                city: 'Dnipro',
                properties: action.payload[1].properties,
                avgPrice: action.payload[1].avgPrice,
                pictureUrl: 'http://meandyoukraine.com/mainContent/DniproCity/DniproCity_featuredImage.jpg',
                flagUrl: 'http://proudofukraine.com/wp-content/uploads/2015/06/Ukrainian-flag.png'
            },
            2:{
                id: 3,
                city: 'Ternopil',
                properties: action.payload[2].properties,
                avgPrice: action.payload[2].avgPrice,
                pictureUrl: 'http://www.gazeta-misto.te.ua/wp-content/uploads/2017/05/18671255_1124933304279283_1785861677540967562_n.jpg',
                flagUrl: 'http://proudofukraine.com/wp-content/uploads/2015/06/Ukrainian-flag.png'
            },
            3:{
                id: 4,
                city: 'Kyiv',
                properties: action.payload[3].properties,
                avgPrice: action.payload[3].avgPrice,
                pictureUrl: 'https://s.inyourpocket.com/gallery/130361.jpg',
                flagUrl: 'http://proudofukraine.com/wp-content/uploads/2015/06/Ukrainian-flag.png'
            },
            4:{
                id: 5,
                city: 'Odessa',
                properties: action.payload[4].properties,
                avgPrice: action.payload[4].avgPrice,
                pictureUrl: 'https://www.hotel-deribas.com/wp-content/uploads/2018/03/19odessa.jpg',
                flagUrl: 'http://proudofukraine.com/wp-content/uploads/2015/06/Ukrainian-flag.png'
            },
            5:{
                id: 6,
                city: 'Kharkiv',
                properties: action.payload[5].properties,
                avgPrice: action.payload[5].avgPrice,
                pictureUrl: 'http://www.yoldasin.com/wp-content/uploads/2017/04/kharkiv-tren-istasyonu-960x638.jpg',
                flagUrl: 'http://proudofukraine.com/wp-content/uploads/2015/06/Ukrainian-flag.png'
            }
        };
            //const cityInfos = CITY_INFOS.map(x => ({...x}))
            console.log('Hello from reducer', CITY_INFOS)
            return {...state, cityInfos: CITY_INFOS}

        default:
            return state;

    }
}

export default cityInfosReducer;

// var CITY_INFOS = [{
//     id: 1,
//     city: 'Lviv',
//     properties: 4098,
//     avgPrice: 12012,
//     pictureUrl: 'http://www.mgi4ua.com/wp-content/uploads/2017/11/lviv-ukraine.jpg',
//     flagUrl: 'http://proudofukraine.com/wp-content/uploads/2015/06/Ukrainian-flag.png'
// },
//     {
//         id: 2,
//         city: 'Dnipro',
//         properties: 202,
//         avgPrice: 112,
//         pictureUrl: 'http://meandyoukraine.com/mainContent/DniproCity/DniproCity_featuredImage.jpg',
//         flagUrl: 'http://proudofukraine.com/wp-content/uploads/2015/06/Ukrainian-flag.png'
//     },
//     {
//         id: 3,
//         city: 'Ternopil',
//         properties: 1202,
//         avgPrice: 1012,
//         pictureUrl: 'http://www.gazeta-misto.te.ua/wp-content/uploads/2017/05/18671255_1124933304279283_1785861677540967562_n.jpg',
//         flagUrl: 'http://proudofukraine.com/wp-content/uploads/2015/06/Ukrainian-flag.png'
//     }, {
//         id: 4,
//         city: 'Kyiv',
//         properties: 92202,
//         avgPrice: 182032,
//         pictureUrl: 'https://s.inyourpocket.com/gallery/130361.jpg',
//         flagUrl: 'http://proudofukraine.com/wp-content/uploads/2015/06/Ukrainian-flag.png'
//     },
//     {
//         id: 5,
//         city: 'Odessa',
//         properties: 5602,
//         avgPrice: 2082,
//         pictureUrl: 'https://www.hotel-deribas.com/wp-content/uploads/2018/03/19odessa.jpg',
//         flagUrl: 'http://proudofukraine.com/wp-content/uploads/2015/06/Ukrainian-flag.png'
//     },
//     {
//         id: 6,
//         city: 'Kharkiv',
//         properties: 602,
//         avgPrice: 282,
//         pictureUrl: 'http://www.yoldasin.com/wp-content/uploads/2017/04/kharkiv-tren-istasyonu-960x638.jpg',
//         flagUrl: 'http://proudofukraine.com/wp-content/uploads/2015/06/Ukrainian-flag.png'
//     }
// ];
