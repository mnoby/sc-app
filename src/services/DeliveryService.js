import firebase from "../firebase"

const db = firebase.collection("delivery_types")

class DeliveryService {
  getAll() {
    return db
  }

  create(type) {
    return db.add(type)
  }

  update(id, value) {
    return db.doc(id).update(value)
  }

  delete(id) {
    return db.doc(id).delete()
  }
}

export default new DeliveryService()
