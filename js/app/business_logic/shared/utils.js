
function stripAllFieldsFrom(entity) {
  entity = entity || {};
  return {
    except: function(allowableFields) {
      if (!Array.isArray(allowableFields)) {
        allowableFields = [allowableFields];
      }
      allowableFields.forEach((field, index) => {
        allowableFields[index] = field.toLowerCase();
      });
      Object.keys(entity).forEach(function(field) {
        if (allowableFields.indexOf(field.toLowerCase()) === -1) {
          delete entity[field];
        }
      });
    }
  }
}

function convert(value, prop) {
  function toFloat() {
    var parsed = parseFloat(value[prop]);
    if (parsed) {
      value[prop] = parsed;
    } 
  }

  function toInt() {
    var parsed = parseInt(value[prop], 10);
    if (parsed) {
      value[prop] = parsed;
    } 
  }

  return {
    toFloat: toFloat,
    toInt: toInt
  };
}

function chunkArray(inputArray, perChunk = 2) {
  var result = inputArray.reduce((resultArray, item, index) => { 
    const chunkIndex = Math.floor(index/perChunk)

    if(!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }

    resultArray[chunkIndex].push(item)

    return resultArray
  }, [])

  return result;
}

module.exports = {
  stripAllFieldsFrom: stripAllFieldsFrom,
  convert: convert,
  chunkArray,
}
