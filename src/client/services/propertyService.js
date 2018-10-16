import api from "../helpers/api";
import history from "client/history";

class PropertyService {
    normalizeProperty = data => {
        const {
            basicFacility,
            accommodationRule,
            vatIncluded,
            rooms,
            address
        } = data;

        return {
            ...data,
            basicFacility: this.normalizeBasicFacility(basicFacility),
            accommodationRule: this.normalizeAccommodationRule(
                accommodationRule
            ),
            vatIncluded: Boolean(vatIncluded),
            coordinates: this.normalizeCoordinates(address),
            address: address.fullAddress,
            rooms: rooms.map(x => ({
                ...x,
                roomTypeId: x.roomType.id,
                bedInRooms: x.bedInRooms.map(bir => ({
                    ...bir,
                    bedTypeId: bir.bedType.id
                }))
            }))
        };
    };

    normalizeCoordinates = address => {
        if (!address) return {};
        const { lat, lng } = address;
        return { lat, lng };
    };

    normalizeBasicFacility = basicFacility => {
        if (!basicFacility) return {};

        const {
            hasInternet,
            hasParking,
            isPrivate,
            isOnTerritory,
            needToBook
        } = basicFacility;
        return {
            hasInternet: hasInternet !== "absent",
            hasParking: hasParking !== "absent",
            isPrivate: Boolean(isPrivate),
            isOnTerritory: Boolean(isOnTerritory),
            needToBook: Boolean(needToBook)
        };
    };

    normalizeAccommodationRule = accommodationRule => {
        if (!accommodationRule) return {};
        const { cancelReservation, checkInCheckOut = {} } = accommodationRule;

        return {
            cancelReservation: Boolean(cancelReservation),
            arrivalTimeStart: checkInCheckOut.arrivalFrom,
            arrivalTimeEnd: checkInCheckOut.arrivalTo,
            departureTimeStart: checkInCheckOut.departureFrom,
            departureTimeEnd: checkInCheckOut.departureTo
        };
    };

    remapProperty(property) {
        if (property) {
            const images = property.images.map((image) => {
                return {
                    url: image.url
                };
            });
            const accomodiationRule = {
                CheckInCheckOut: {
                    arrivalFrom: property.accommodationRule.arrivalTimeStart,
                    arrivalTo: property.accommodationRule.arrivalTimeEnd,
                    departureFrom: property.accommodationRule.departureTimeStart,
                    departureTo: property.accommodationRule.departureTimeEnd
                },
                cancelReservation: property.accommodationRule.cancelReservation
            };
            const facilities = property.facilityLists.map((list) => {
                return {
                    id: list.facility.id,
                    name: list.facility.name
                };
            });
            const paymentTypes = property.paymentTypes.map((paymentType) => {
                return {
                    id: paymentType.id,
                    name: paymentType.name
                };
            });
            const languages = property.languages.map((language) => {
                return {
                    id: language.id,
                    name: language.name
                };
            });
            const address = {
                fullAddress: property.address,
                lat: property.coordinates.lat,
                lng: property.coordinates.lng
            }

            return {
                id: property.id,
                name: property.name,
                description: property.description,
                propertyTypeId: property.propertyType.id,
                currencyId: property.currency.id,
                contactPersonName: property.contactPersonName,
                contactPhone: property.contactPhone,
                address: address,
                address1: '',
                countryId: property.city.country.id,
                cityId: property.city.id,
                rooms: property.rooms,
                images: images,
                accommodationRule: accomodiationRule,
                paymentTypes: paymentTypes,
                languages: languages,
                facilities: facilities
                // basicFacility.hasInternet
                // basicFacility.internetPrice
                // basicFacility.hasParking
                // basicFacility.isPrivate
                // basicFacility.isOnTerritory
                // basicFacility.needToBook
                // basicFacility.parkingPrice
            };
        }
        return {};
    }

    createProperty = data => {
        const body = this.normalizeProperty(data);

        return api
            .sendAuthRequest("/api/property/", "post", body)
            .then(response => {
                if (response.status === 200) {
                    history.push("/");
                }

                return response.data;
            });
    };

    updateProperty(data) {
        return api
            .sendAuthRequest(`/api/property/${data.propertyId}`, "put", data)
            .then(response => {
                // console.log(response);
            });
    }

    getUserPropertiesInfo(data) {
        return api
            .sendRequest(`/api/property/${data.id}/info`, "get")
            .then(response => response.data);
    }
    getPropertiesByCity(city) {
        return api
            .sendRequest(`api/property/city/${city}`, "get")
            .then(response => response.data);
    }
}

export default new PropertyService();
