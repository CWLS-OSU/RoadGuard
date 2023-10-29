const fetch = require("node-fetch")

async function get_info() {
    const API_ENDPOINT = "https://datahub.transportation.gov/resource/nm7w-nvbm.json?$query=SELECT%0A%20%20%60datatype%60%2C%0A%20%20%60metadata_generatedat%60%2C%0A%20%20%60metadata_generatedby%60%2C%0A%20%20%60metadata_logfilename%60%2C%0A%20%20%60metadata_schemaversion%60%2C%0A%20%20%60metadata_rsuid%60%2C%0A%20%20%60metadata_kind%60%2C%0A%20%20%60metadata_psid%60%2C%0A%20%20%60metadata_bsmsource%60%2C%0A%20%20%60metadata_externalid%60%2C%0A%20%20%60coredata_msgcnt%60%2C%0A%20%20%60coredata_id%60%2C%0A%20%20%60coredata_secmark%60%2C%0A%20%20%60coredata_position_lat%60%2C%0A%20%20%60coredata_position_long%60%2C%0A%20%20%60coredata_elevation%60%2C%0A%20%20%60coredata_accelset_accelyaw%60%2C%0A%20%20%60coredata_accelset_lat%60%2C%0A%20%20%60coredata_accelset_long%60%2C%0A%20%20%60coredata_accelset_vert%60%2C%0A%20%20%60coredata_angle%60%2C%0A%20%20%60coredata_accuracy_orientation%60%2C%0A%20%20%60coredata_accuracy_semimajor%60%2C%0A%20%20%60coredata_accuracy_semiminor%60%2C%0A%20%20%60coredata_transmission%60%2C%0A%20%20%60coredata_speed%60%2C%0A%20%20%60coredata_heading%60%2C%0A%20%20%60coredata_brakes_wheelbrakes%60%2C%0A%20%20%60coredata_brakes_wheelbrakes_2%60%2C%0A%20%20%60coredata_brakes_wheelbrakes_4%60%2C%0A%20%20%60coredata_brakes_wheelbrakes_1%60%2C%0A%20%20%60coredata_brakes_wheelbrakes_3%60%2C%0A%20%20%60coredata_brakes_traction%60%2C%0A%20%20%60coredata_brakes_abs%60%2C%0A%20%20%60coredata_brakes_scs%60%2C%0A%20%20%60coredata_brakes_brakeboost%60%2C%0A%20%20%60coredata_brakes_auxbrakes%60%2C%0A%20%20%60coredata_size%60%2C%0A%20%20%60part2_suve_classification%60%2C%0A%20%20%60part2_suve_cd_hpmstype%60%2C%0A%20%20%60part2_suve_cd_role%60%2C%0A%20%20%60part2_suve_vd_height%60%2C%0A%20%20%60part2_suve_vd_mass%60%2C%0A%20%20%60part2_suve_vd_bumpers_front%60%2C%0A%20%20%60part2_suve_vd_bumpers_rear%60%2C%0A%20%20%60part2_vse_events%60%2C%0A%20%20%60part2_vse_ph_crumbdata%60%2C%0A%20%20%60part2_vse_pp_confidence%60%2C%0A%20%20%60part2_vse_pp_radiusofcurve%60%2C%0A%20%20%60part2_vse_lights%60%2C%0A%20%20%60coredata_position%60%2C%0A%20%20%60randomnum%60%2C%0A%20%20%60metadata_generatedat_timeofday%60%2C%0A%20%20%60%3A%40computed_region_28hd_vqqn%60";

    const BING_API_KEY = "AhCT33nMic-GNK9VFeGnvndEToXe8uLM_SpsfKOFAiim4MEbpBqUVvyfUA7MdTLh"

    const data = await fetch(API_ENDPOINT);
    const data_json = await data.json();
    //array -> (speed, lat, long, zipCode, speedLimit)
    const result = []


    //coredata_speed
    //coredata_position_lat
    //coredata_position_long

    for (i = 350; i < 389; i++) {
        console.log("index: ", i);
        const current_vehicle = data_json[i];
        let speed = current_vehicle["coredata_speed"];
        let lat = current_vehicle["coredata_position_lat"];
        let long = current_vehicle["coredata_position_long"];

        unconverted_arr = [speed, lat, long];

        if (speed != 8191 && lat != 900000001 && long != 1800000001) {
            speed = Math.ceil((speed * 0.02) * 2.2369);
            lat = (lat * (10**-7)).toFixed(2);
            long = (long * (10**-7)).toFixed(2);

            // const URL = `https://dev.virtualearth.net/REST/v1/Routes/SnapToRoadAsync?points=27.9469,-82.4576&interpolate=false&includeSpeedLimit=true&includeTruckSpeedLimit=false&speedUnit=MPH&travelMode=driving&key=AhCT33nMic-GNK9VFeGnvndEToXe8uLM_SpsfKOFAiim4MEbpBqUVvyfUA7MdTLh`

            let URL_RESULT = await fetch(`https://dev.virtualearth.net/REST/v1/Routes/SnapToRoadAsync?points=${lat},${long}&interpolate=${false}&includeSpeedLimit=${true}&includeTruckSpeedLimit=${false}&speedUnit=MPH&travelMode=driving&key=${BING_API_KEY}`);
            URL_RESULT = await URL_RESULT.json();

            call_back = URL_RESULT["resourceSets"][0]["resources"][0]["callbackUrl"]
            let CALL_BACK_RESULT = await fetch(call_back);
            CALL_BACK_RESULT = await CALL_BACK_RESULT.json();
            
            let resultUrl = CALL_BACK_RESULT["resourceSets"][0]["resources"][0]["resultUrl"];
            
            if (resultUrl != undefined) {
                let resultUrlValue = await fetch(resultUrl);
                resultUrlValue = await resultUrlValue.json();

                const snappedPoints = resultUrlValue["resourceSets"][0]["resources"][0]["snappedPoints"]
                const speedLimit = snappedPoints[0]["speedLimit"]

                const GOOGLE_MAPS_API_KEY = "AIzaSyCSMqTztIUtM3_axacE6IDLZqksbdwq5F8"
                const GEOCODE_API = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${GOOGLE_MAPS_API_KEY}`

                let geocode_data = await fetch(GEOCODE_API);
                geocode_data = await geocode_data.json();

                const results = geocode_data["results"];
                let zipcode;
                
                for (j = 0; j < results.length; j++) {
                    formatted_address = results[j]["formatted_address"];
                    formatted_address_split = formatted_address.split(",");

                    for (k = 0; k < formatted_address_split.length; k++) {
                        if (formatted_address_split[k].includes("FL")) {
                            zipcode = formatted_address_split[k].substring(4, formatted_address_split[k].length);
                        }

                        if (zipcode) {
                            break;
                        }
                    }

                    if (zipcode) {
                        break;
                    }
                }

                let new_arr = [speed, lat, long, zipcode, speedLimit];
                new_arr.push(unconverted_arr);
                result.push(new_arr);
            }
        }
    }

    return result;
}

async function difference_in_speed() {
    const result = await get_info();
    const final_result = [];

    for (i = 0; i < result.length; i++) {
        const current_vehicle = result[i];

        if (current_vehicle[current_vehicle.length - 2] != 0) {
            const difference = current_vehicle[0] - current_vehicle[current_vehicle.length - 2];

            if (difference > 0) {
                final_result.push(current_vehicle[current_vehicle.length - 1]);
            }
        }
    }

    return final_result;
}

difference_in_speed().then((result) => {
    console.log(result);
})
