import firebase from "../firebase"

const db = firebase.collection("/orders")

class OrderService {
  getAll() {
    return db
  }

  create(order) {
    return db.add(order)
  }

  update(id, value) {
    return db.doc(id).update(value)
  }

  delete(id) {
    return db.doc(id).delete()
  }
}

export default new OrderService()
