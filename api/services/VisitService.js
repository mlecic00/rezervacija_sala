import CRUDService from "./CRUDService";

export default class VisitService extends CRUDService {
  constructor() {
    super();
    this.urlExtension = "assets/data/reservations.json";
  }
}
