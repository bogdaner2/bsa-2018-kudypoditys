const Repository = require("./generalRepository");
const propertyModel = require("../models/Property");
const Facility = require("../models/Facility");
const PaymentType = require("../models/PaymentType");
const Sequelize = require("sequelize");
const Reservation = require("../models/Reservation");
const RoomType = require("../models/RoomType");
const Image = require("../models/Image");
const Favorite = require("../models/Favorite");
const AccommodationRule = require("../models/AccommodationRule");
const PropertyType = require("../models/PropertyType");
const PropertyPaymentType = require("../models/PropertyPaymentType");
const Country = require("../models/Country");
const City = require("../models/City");
const Review = require("../models/Review");
const User = require("../models/User");
const Room = require("../models/Room");
const FacilityList = require("../models/FacilityList");
const BedInRoom = require("../models/BedInRoom");
const BedType = require("../models/BedType");
const PropertyLanguage = require("../models/PropertyLanguage");
const BasicFacility = require("../models/BasicFacility");
const FacilityCategory = require("../models/FacilityCategory");
const AvailabilityRepository = require("./availabilityRepository");
const RoomRepository = require("./roomRepository");
const Availability = require("../models/Availability");
const moment = require("moment");

const includeOptions = [
    {
        model: PropertyType,
        attributes: ["id", "name", "description"]
    },
    {
        model: City,
        attributes: ["id", "name"],
        include: [{ model: Country, attributes: ["id", "name"] }]
    },
    {
        model: AccommodationRule,
        attributes: [
            "id",
            "allowPets",
            "cancelReservation",
            "minimumStay",
            "arrivalTimeStart",
            "arrivalTimeEnd",
            "departureTimeStart",
            "departureTimeEnd"
        ]
    },
    {
        model: Image,
        attributes: ["id", "url", "propertyId", "roomId"]
    },
    {
        model: Review,
        attributes: [
            "id",
            "pros",
            "cons",
            "Cleanliness",
            "Price",
            "Comfort",
            "Facilities",
            "avgReview",
            "createdAt",
            "anon"
        ],
        include: [
            {
                model: User,
                attributes: ["id", "fullName", "email", "avatar", "phoneNumber"]
            }
        ]
    },
    {
        model: Room,
        attributes: ["id", "price", "amount", "area", "description"],
        include: [
            { model: RoomType, attributes: ["id", "name"] },
            {
                model: BedInRoom,
                attributes: ["count"],
                include: [{ model: BedType, attributes: ["id", "name"] }]
            }
        ]
    },
    {
        model: FacilityList,
        attributes: ["belongsToProperty"],
        include: [
            {
                model: Facility,
                attributes: ["id", "name"],
                include: { model: FacilityCategory, attributes: ["name"] }
            }
        ]
    },
    {
        model: PaymentType,
        attributes: ["name", "id"]
    }
];

class PropertyRepository extends Repository {
    findById(id) {
        return this.model.findById(id, {
            attributes: [
                "id",
                "name",
                "address",
                "rating",
                "description",
                "coordinates",
                "contactPhone"
            ],
            include: includeOptions
        });
    }

    getDetailsById(id) {
        return this.model
            .findOne({
                where: {
                    id: id
                },
                include: [
                    City,
                    PropertyType,
                    AccommodationRule,
                    {
                        model: Review,
                        include: [User]
                    },
                    Facility,
                    Room,
                    PaymentType
                ]
            })
            .then(x => {
                return Favorite.count({
                    where: {
                        propertyId: x.id
                    }
                }).then(likes => {
                    x.dataValues.likes = likes;
                    return x;
                });
            });
    }

    getPropertiesByCity(city) {
        console.log(city);
        return this.model
            .findAll({
                where: {
                    cityId: city
                },
                include: [
                    {
                        model: City
                    },
                    {
                        model: Image
                    },
                    {
                        model: Review
                    },

                    {
                        model: Room,
                        include: [
                            RoomType,
                            {
                                model: BedInRoom
                                // where: {
                                //     count: { $gte: filter.bedsCount }
                                // }
                            },
                            {
                                model: Reservation
                                //    where: {
                                // dateIn: { $gte: moment().subtract(10, 'days').toDate()},
                                //dateOut: { $lte: moment().add(5, 'days').toDate()}
                                //   }
                            }
                        ]
                    }
                ]
            })
            .then(properties => {
                return properties;
            });
    }

    getDaysArrayByMonth(id, amount, price) {
        let daysInMonth = moment().daysInMonth();
        const arrDays = [];
        while (daysInMonth) {
            let current = {
                roomId: id,
                amount: amount,
                date: moment().date(daysInMonth),
                price: price
            };
            arrDays.push(current);
            daysInMonth--;
        }
        return arrDays.reverse();
    }

    createDetails(entity) {
        return this.model
            .create(entity, {
                include: [
                    AccommodationRule,
                    BasicFacility,
                    Image,
                    {
                        model: Room,
                        include: [BedInRoom]
                    }
                ]
            })
            .then(({ dataValues: newProperty }) => {
                let facilityList = entity.facilities.map(f => ({
                    propertyId: newProperty.id,
                    facilityId: f.id
                }));
                return FacilityList.bulkCreate(facilityList).then(
                    _ => newProperty
                );
            })
            .then(newProperty => {
                let languages = entity.languages.map(l => ({
                    propertyId: newProperty.id,
                    languageId: l.id
                }));

                return PropertyLanguage.bulkCreate(languages).then(
                    _ => newProperty
                );
            })
            .then(newProperty => {
                let paymentTypes = entity.paymentTypes.map(p => ({
                    propertyId: newProperty.id,
                    paymentTypeId: p.id
                }));

                return PropertyPaymentType.bulkCreate(paymentTypes).then(
                    _ => newProperty
                );
            })
            .then(newProperty => {
                let propertyRooms = RoomRepository.findByOptions({
                    propertyId: newProperty.id
                });
                propertyRooms.map(room => {
                    let availabilities = this.getDaysArrayByMonth(
                        room.id,
                        room.amount,
                        room.price
                    );
                    availabilities.map(availability => {
                        AvailabilityRepository.create(availability);
                    });
                });
                return newProperty;
            })
            .then(newProperty => this.findById(newProperty.id));
    }
    getFacilityId(facilityStr) {
        let facilityId;
        switch (facilityStr) {
            case "Fitness_spa_locker_rooms":
                facilityId = 1; //id from seed
                break;
            // case 'Queen_bed':
            //     facilityId = 3;
            //     break;
            case "Dogs":
            case "Dogs":
                facilityId = 5;
                break;

            case "Full_body_massage":
                facilityId = 3;
                break;

            case "Daily_maid_service":
                facilityId = 8;
                break;
            case "Laundry":
                facilityId = 11;
                break;

            case "Walking tours":
                facilityId = 16;
                break;
            case "Live_music_performance":
                facilityId = 13;
                break;
            case "Live_sport_events":
                facilityId = 12;
                break;
            case "Themed_dinner_nights":
                facilityId = 14;
                break;

            case "Movie_nights":
                facilityId = 17;
                break;
            default:
                facilityId = -1;
        }

        return facilityId;
    }
    getBedTypeId(bedTypeStr) {
        let bedTypeId;
        switch (bedTypeStr) {
            case "Queen_bed":
                bedTypeId = 3; //id from seed
                break;
            default:
                bedTypeId = -1;
        }
        return bedTypeId;
    }
    getFilteredProperties(filter) {
        console.log("filter " + JSON.stringify(filter));
        const SORT_VALUE = {
            PRICE: "price",
            DISTANCE: "distance_to_center",
            LOW_RANK: "rating_starting_from_low",
            HIGH_RANK: "rating_starting_from_high"
        };

        let sortingOption;
        switch (filter.sortBy) {
            case SORT_VALUE.PRICE:
                sortingOption = [[Room, "price", "ASC"]];
                break;
            case SORT_VALUE.DISTANCE:
                sortingOption = [["distanceToCentre", "ASC"]];
                break;
            case SORT_VALUE.LOW_RANK:
                sortingOption = [["rating", "ASC"]];
                break;
            case SORT_VALUE.HIGH_RANK:
                sortingOption = [["rating", "DESC"]];
                break;
            default:
                sortingOption = [["rating"]];
                sortingOption = Sequelize.literal(
                    "(" +
                        filter.propertiesIds
                            .map(function(id) {
                                return '"property"."id" = \'' + id + "'";
                            })
                            .join(", ") +
                        ") DESC"
                );
        }

        let facilityOption =
            filter.dogs !== "" ||
            filter.fitness_spa_locker_rooms !== "" ||
            filter.full_body_massage !== "" ||
            filter.daily_maid_service !== "" ||
            filter.laundry !== "" ||
            filter.walking_tours !== "" ||
            filter.live_music_performance !== "" ||
            filter.live_sport_events !== "" ||
            filter.themed_dinner_nights !== "" ||
            filter.movie_nights !== ""
                ? [
                      {
                          model: Facility,
                          required: true,
                          where: {
                              id: [
                                  this.getFacilityId(filter.dogs),
                                  this.getFacilityId(
                                      filter.fitness_spa_locker_rooms
                                  ),
                                  this.getFacilityId(filter.full_body_massage),
                                  this.getFacilityId(filter.daily_maid_service),
                                  this.getFacilityId(filter.laundry),
                                  this.getFacilityId(filter.walking_tours),
                                  this.getFacilityId(
                                      filter.live_music_performance
                                  ),
                                  this.getFacilityId(filter.live_sport_events),
                                  this.getFacilityId(
                                      filter.themed_dinner_nights
                                  ),
                                  this.getFacilityId(
                                      filter.themed_dinner_nights
                                  ),
                                  this.getFacilityId(filter.movie_nights)
                              ]
                          },
                          include: { model: FacilityCategory }
                      }
                  ]
                : [Facility];

        let bedsInRoomOption =
            filter.queen_bed || filter.full_bed //we don't send full bad type yet
                ? {
                      model: BedInRoom,
                      where: {
                          count: { $gte: filter.bedsCount },
                          bedTypeId: {
                              $in: [this.getBedTypeId(filter.queen_bed)]
                          }
                      }
                  }
                : {
                      model: BedInRoom,
                      where: {
                          count: { $gte: filter.bedsCount }
                      }
                  };

        let offsetData = filter.page ? 5 * (filter.page - 1) : 0;

        return this.model
            .findAndCountAll({
                limit: 5,
                offset: offsetData,
                where: {
                    id: { $in: filter.propertiesIds }
                },
                distinct: true,
                // order: Sequelize.literal(
                //     "(" +
                //         filter.propertiesIds
                //             .map(function(id) {
                //                 return '"property"."id" = \'' + id + "'";
                //             })
                //             .join(", ") +
                //         ") DESC"
                // ),
                order: sortingOption,
                include: [
                    {
                        model: City
                    },
                    {
                        model: Image
                    },
                    {
                        model: Review
                    },
                    {
                        model: FacilityList,
                        include: facilityOption

                        //     [
                        //     {
                        //         model: Facility,
                        //         where: { id: { $in: [5] } },
                        //     }
                        // ]
                    },

                    {
                        model: Room,
                        where: {
                            amount: { $gte: filter.rooms }
                        },
                        include: [
                            RoomType,

                            bedsInRoomOption,
                            {
                                model: Reservation,
                                required: false,
                                where: {
                                    $and: [
                                        {
                                            dateIn: {
                                                $notBetween: [
                                                    filter.dateIn, // new Date("2018-09-16"),
                                                    filter.dateOut // new Date("2018-09-17")
                                                ]
                                            }
                                        },
                                        {
                                            dateOut: {
                                                $notBetween: [
                                                    filter.dateIn, // new Date("2018-09-16"),
                                                    filter.dateOut // new Date("2018-09-17")
                                                ]
                                            }
                                        }
                                        // {
                                        //     $not: [
                                        //         {
                                        //             $and: [
                                        //                 {
                                        //                     dateIn: {
                                        //                         $gte:
                                        //                             filter.dateIn
                                        //                     }
                                        //                 },
                                        //                 {
                                        //                     dateOut: {
                                        //                         $lte:
                                        //                             filter.dateOut
                                        //                     }
                                        //                 }
                                        //             ]
                                        //         }
                                        //     ]
                                        // }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            })
            .then(properties => {
                return properties;
            });
    }

    findAll() {
        return this.model
            .findAll({
                where: {},
                include: [
                    {
                        model: City
                    },
                    {
                        model: Image
                    },
                    {
                        model: Review
                    },
                    {
                        model: Room,
                        required: true,
                        include: [
                            { model: RoomType },
                            {
                                model: BedInRoom
                            }
                        ]
                    }
                ]
            })
            .then(properties => {
                return properties;
            });
    }

    getUserPropertiesInfo(id) {
        return this.model.findAll({
            where: {
                userId: id
            },
            include: [
                {
                    model: Room,
                    include: [
                        {
                            model: Reservation,
                            include: [
                                {
                                    model: User
                                }
                            ]
                        },
                        {
                            model: Availability
                        },
                        {
                            model: RoomType
                        }
                    ]
                },
                {
                    model: Image,
                    attributes: ["id", "url", "propertyId", "roomId"]
                },
                {
                    model: Review
                }
            ]
        });
    }
}

module.exports = new PropertyRepository(propertyModel);
