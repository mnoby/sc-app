import firebase from "../firebase"

const db = firebase.collection("products")

class ProductService {
  getAll(value) {
    return db.orderBy(value)
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

export default new ProductService()

