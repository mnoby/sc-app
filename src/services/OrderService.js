import firebase from "../firebase"

const db = firebase.collection("/orders")

class OrderService {
  getAll(value, sort) {
    return db.orderBy(value, sort)
  }

  getLatest(value, sort, limit) {
    return db.orderBy(value, sort).limit(limit)
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
