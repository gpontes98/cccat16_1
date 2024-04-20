import { PgPromiseAdapter } from "./infraestructure/database/DatabaseConnection";
import { AccountController } from "./infraestructure/http/AccountController";
import { ExpressAdapter } from "./infraestructure/http/HttpServer";
import { RideController } from "./infraestructure/http/RideController";
import { AccountRepositoryDatabase } from "./infraestructure/repository/AccountRepository";
import { RideRepositoryDatabase } from "./infraestructure/repository/RideRepository";
import { GetAccount } from "./application/usecases/GetAccount";
import { GetRide } from "./application/usecases/GetRide";
import { Signup } from "./application/usecases/Signup";
import { StartRide } from "./application/usecases/StartRide";

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(connection);
const signUp = new Signup(accountRepository);
const getAccount = new GetAccount(accountRepository);

const RideRepository = new RideRepositoryDatabase(connection);
const startRide = new StartRide(RideRepository, accountRepository);
const getRide = new GetRide(RideRepository);

new AccountController(httpServer, signUp, getAccount);
new RideController(httpServer, startRide, getRide);
httpServer.listen(3000);
