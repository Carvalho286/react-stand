function CarService(CarModel) {
  let service = {
    create,
    findAll,
    findById,
    update,
    removeById,
    findByMarca,
    changeDisponibilidadeToFalse,
  };

  function create(values) {
    let newCar = CarModel(values);
    return save(newCar);
  }

  function save(newCar) {
    return new Promise(function (resolve, reject) {
      newCar.save(function (err) {
        if (err) reject(err);
        resolve("Carro adicionado com sucesso");
      });
    });
  }

  function findAll() {
    return new Promise(function (resolve, reject) {
      CarModel.find({}, function (err, cars) {
        if (err) reject(err);
        resolve(cars);
      });
    });
  }

  function findById(id) {
    return new Promise(function (resolve, reject) {
      CarModel.findById(id, function (err, car) {
        if (err) reject(err);
        resolve(car);
      });
    });
  }

  function update(id, values) {
    return new Promise(function (resolve, reject) {
      CarModel.findByIdAndUpdate(id, values, function (err, car) {
        if (err) reject(err);
        resolve("Carro atualizado com sucesso \n" + car);
      });
    });
  }

  function removeById(id) {
    return new Promise(function (resolve, reject) {
      CarModel.findByIdAndRemove(id, function (err) {
        console.log(err);
        if (err) reject(err);
        resolve();
      });
    });
  }

  function findByMarca(marca) {
    return new Promise(function (resolve, reject) {
      CarModel.find({ marca }, function (err, car) {
        if (err) reject(err);
        resolve(car);
      });
    });
  }

  function changeDisponibilidadeToFalse() {
    return (request, response, next) => {
      const values = request.body;
      const id = values.car;
      var myquery = { disponibilidade: false };
      CarModel.findByIdAndUpdate(id, myquery, function (err) {
        next();
      });
    };
  }
  return service;
}

module.exports = CarService;
