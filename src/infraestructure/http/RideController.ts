import { GetRide } from "../../application/usecases/GetRide";
import { StartRide } from "../../application/usecases/StartRide";
import HttpServer from "./HttpServer";

export class RideController {
	constructor(
		readonly httpServer: HttpServer,
		readonly startRide: StartRide,
		readonly getRide: GetRide
	) {
		httpServer.register(
			"post",
			"/ride",
			async function (params: any, body: any) {
				const output = await startRide.execute(body);
				return output;
			}
		);

        httpServer.register(
            "get",
            "/ride/:{rideId}",
            async function (params: any) {
				const input = {
					rideId: params.rideId
				}
				const output = await getRide.execute(input);
                return output;
            }
        );
	}
}
