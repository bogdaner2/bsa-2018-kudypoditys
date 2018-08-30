const {
    USERS,
    PROPERTIES,
    ACCOMMODATION_RULES,
    ROOMS,
    IMAGES,
    RESERVATIONS,
    COUNTRIES,
    DISCOUNTS,
    PAYMENT_TYPES,
    ROLES,
    FACILITY_CATEGORIES,
    REVIEW_CATEGORIES,
    BED_TYPES,
    ROOM_TYPES,
    PROPERTY_TYPE
} = require("./seed");

module.exports = function(models) {
    const {
        Country,
        City,
        PaymentType,
        BedType,
        Discount,
        Role,
        FacilityCategory,
        Facility,
        ReviewCategory,
        RoomType,
        PropertyType,
        Property,
        AccommodationRule,
        Room,
        Reservation,
        Image,
        User
    } = models;

    const SimpleUpsertMap = [
        [PaymentType, PAYMENT_TYPES],
        [BedType, BED_TYPES],
        [Discount, DISCOUNTS],
        [Role, ROLES],
        [ReviewCategory, REVIEW_CATEGORIES],
        [RoomType, ROOM_TYPES],
        [PropertyType, PROPERTY_TYPE],
        [AccommodationRule, ACCOMMODATION_RULES],
        [Property, PROPERTIES],
        [Room, ROOMS],
        [Image, IMAGES],
        [User, USERS],
        [Reservation, RESERVATIONS]
    ];

    for (const mapItem of SimpleUpsertMap) {
        for (const itemToInsert of mapItem[1]) {
            mapItem[0].upsert(itemToInsert);
        }
    }

    //Country & City
    const CITIES = COUNTRIES.reduce((accumulator, country) => {
        const citiesWithCountry = country.cities.map(x => ({
            ...x,
            countryId: country.id
        }));
        return [...accumulator, ...citiesWithCountry];
    }, []);

    for (const c of COUNTRIES) {
        Country.upsert(c);
    }

    for (const c of CITIES) {
        City.upsert(c);
    }

    //Facility & FacilityCategory
    const FACILITY = FACILITY_CATEGORIES.reduce(
        (accumulator, facilityCategory) => {
            const facilityWithFacilityCategory = facilityCategory.facilities.map(
                x => ({
                    ...x,
                    facilityCategoryId: facilityCategory.id
                })
            );
            return [...accumulator, ...facilityWithFacilityCategory];
        },
        []
    );

    for (const fc of FACILITY_CATEGORIES) {
        FacilityCategory.upsert(fc);
    }

    for (const f of FACILITY) {
        Facility.upsert(f);
    }

    // User.upsert({
    //     fullName: 'Doctor Strange',
    //     password: '$2b$10$tT5Nz5oq3OuImIMaxqRt5eu9gPmVOH5yJgKIR88CjvfiKl9itpu/a', // 1234
    //     email: 'nata737mail@gmail.com',
    //     phoneNumber: '0123412312',
    //     avatar: 'https://avatar.com'
    // });
};
