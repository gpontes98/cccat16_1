import { AcceptRide } from "../../application/usecases/AcceptRide";
import { GetRide } from "../../application/usecases/GetRide";
import { RequestRide } from "../../application/usecases/RequestRide";
import { StartRide } from "../../application/usecases/StartRide";
import HttpServer from "./HttpServer";

export class RideController {
	constructor(
		readonly httpServer: HttpServer,
		readonly requestRide: RequestRide,
		readonly getRide: GetRide,
		readonly acceptRide: AcceptRide,
		readonly startRide: StartRide
	) {
		httpServer.register(
			"post",
			"/ride",
			async function (params: any, body: any) {
				const output = await requestRide.execute(body);
				return output;
			}
		);

		httpServer.register(
			"get",
			"/ride/:{rideId}",
			async function (params: any) {
				const input = {
					rideId: params.rideId,
				};
				const output = await getRide.execute(input);
				return output;
			}
		);

		httpServer.register(
			"put",
			"/ride/accept",
			async function (params: any, body: any) {
				const input = {
					rideId: body.rideId,
					driverId: body.driverId,
				};
				const output = await acceptRide.execute(input);
				return output;
			}
		);

		httpServer.register(
			"patch",
			"/ride/start/:{rideId}",
			async function (params: any) {
				const input = {
					rideId: params.rideId,
				};
				const output = await startRide.execute(input);
				return output;
			}
		);
	}
}
