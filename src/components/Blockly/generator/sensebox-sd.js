import Blockly from "blockly";

/* SD-Card Blocks using the Standard SD Library*/
/**
 * Code generator for variable (X) getter.
 * Arduino code: loop { X }
 * @param {Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */

Blockly.Arduino.sensebox_sd_create_file = function (block) {
  var filename = this.getFieldValue("Filename");
  var res = filename.slice(0, 4);
  Blockly.Arduino.libraries_["library_spi"] = "#include <SPI.h>";
  Blockly.Arduino.libraries_["library_sd"] = "#include <SD.h>";
  Blockly.Arduino.definitions_["define_" + res] = "File dataFile" + res + ";";
  Blockly.Arduino.setupCode_["sensebox_sd"] = "SD.begin(28);";
  Blockly.Arduino.setupCode_["sensebox_sd" + filename] =
    "dataFile" +
    res +
    ' = SD.open("' +
    filename +
    '", FILE_WRITE);\ndataFile' +
    res +
    ".close();\n";
  var code = "";
  return code;
};

Blockly.Arduino.sensebox_sd_open_file = function (block) {
  var filename = this.getFieldValue("Filename");
  var res = filename.slice(0, 4);
  var branch = Blockly.Arduino.statementToCode(block, "SD");
  var code = "dataFile" + res + ' = SD.open("' + filename + '", FILE_WRITE);\n';
  code += branch;
  code += "dataFile" + res + ".close();\n";
  return code;
};

Blockly.Arduino.sensebox_sd_write_file = function (block) {
  if (this.parentBlock_ != null) {
    var filename = this.getSurroundParent().getFieldValue("Filename");
  }
  var res = filename.slice(0, 4);
  var text =
    Blockly.Arduino.valueToCode(this, "DATA", Blockly.Arduino.ORDER_ATOMIC) ||
    '"Keine Eingabe"';
  var linebreak = this.getFieldValue("linebreak");
  if (linebreak === "TRUE") {
    linebreak = "ln";
  } else {
    linebreak = "";
  }
  var code = "";
  if (text === "gps.getLongitude()" || text === "gps.getLatitude()") {
    code = "dataFile" + res + ".print" + linebreak + "(" + text + ",5);\n";
  } else {
    code = "dataFile" + res + ".print" + linebreak + "(" + text + ");\n";
  }
  return code;
};

Blockly.Arduino.sensebox_sd_osem = function () {
  var type = this.getFieldValue("type");
  var blocks = this.getDescendants();
  var branch = Blockly.Arduino.statementToCode(this, "DO");
  var count = 0;
  if (blocks !== undefined) {
    for (var i = 0; i < blocks.length; i++) {
      if (blocks[i].type === "sensebox_sd_save_for_osem") {
        count++;
      }
    }
  }
  var num_sensors = count;
  var timestamp = Blockly.Arduino.valueToCode(
    this,
    "timeStamp",
    Blockly.Arduino.ORDER_ATOMIC
  );
  Blockly.Arduino.definitions_["num_sensors"] =
    "static const uint8_t NUM_SENSORS = " + num_sensors + ";";

  Blockly.Arduino.definitions_["measurement"] = `typedef struct measurement {
    const char *sensorId;
    float value;
  } measurement;`;
  Blockly.Arduino.definitions_["buffer"] = "char buffer[750];";
  Blockly.Arduino.definitions_[
    "num_measurement"
  ] = `measurement measurements[NUM_SENSORS];
  uint8_t num_measurements = 0;`;
  if (type === "Stationary") {
    Blockly.Arduino.functionNames_["addMeasurement"] = `
void addMeasurement(const char *sensorId, float value) {
    measurements[num_measurements].sensorId = sensorId;
    measurements[num_measurements].value = value;
    num_measurements++;
    }
`;
    Blockly.Arduino.functionNames_["writeMeasurementsToSdCard"] = `
void writeMeasurementsToSdCard(char* timeStamp) {
    // iterate throug the measurements array
    for (uint8_t i = 0; i < num_measurements; i++) {
sprintf_P(buffer, PSTR("%s,%9.2f,%s"), measurements[i].sensorId, measurements[i].value, timeStamp);         
      // transmit buffer to client
      dataFileData.print(buffer);
      Serial.print(buffer);
    }
    // reset num_measurements
    num_measurements = 0;
}
`;
    Blockly.Arduino.functionNames_["saveValues"] = `
void saveValues() {


      // send measurements
      writeMeasurementsToSdCard(${timestamp}); 
      num_measurements = 0;
} 
`;
    var code = "";
    code += branch;
    code += "saveValues();";
  } else if (type === "Mobile") {
    /**
     * add mobile functions here
     */
    Blockly.Arduino.libraries_["dtostrf.h"] = "#include <avr/dtostrf.h>";
    var lat = Blockly.Arduino.valueToCode(
      this,
      "lat",
      Blockly.Arduino.ORDER_ATOMIC
    );
    var lng = Blockly.Arduino.valueToCode(
      this,
      "lng",
      Blockly.Arduino.ORDER_ATOMIC
    );
    // var altitude = Blockly.Arduino.valueToCode(
    //   this,
    //   "altitude",
    //   Blockly.Arduino.ORDER_ATOMIC
    // );
    Blockly.Arduino.definitions_["num_sensors"] =
      "static const uint8_t NUM_SENSORS = " + num_sensors + ";";

    Blockly.Arduino.definitions_["measurement"] = `typedef struct measurement {
        const char *sensorId;
        float value;
      } measurement;`;
    Blockly.Arduino.definitions_["buffer"] = "char buffer[750];";
    Blockly.Arduino.definitions_[
      "num_measurement"
    ] = `measurement measurements[NUM_SENSORS];
      uint8_t num_measurements = 0;`;
    Blockly.Arduino.functionNames_["addMeasurement"] = `
void addMeasurement(const char *sensorId, float value) {
        measurements[num_measurements].sensorId = sensorId;
        measurements[num_measurements].value = value;
        num_measurements++;
        }
    `;
    Blockly.Arduino.functionNames_["writeMeasurementsToSdCard"] = `
void writeMeasurementsToSdCard(char* timeStamp, uint32_t latitudes, uint32_t longitudes) {
    // iterate throug the measurements array
        for (uint8_t i = 0; i < num_measurements; i++) {
            char lng[20];
            char lat[20];
            float longitude = longitudes / (float)10000000;
            float latitude = latitudes / (float)10000000;
            dtostrf(longitude, 2, 7, lng);
            dtostrf(latitude, 1, 7, lat);
            sprintf_P(buffer, PSTR("%s,%9.2f,%s,%02s,%02s"),  measurements[i].sensorId, measurements[i].value, timeStamp, lng, lat);
            // transmit buffer to client
            dataFileData.print(buffer);
            Serial.print(buffer);
            }
            // reset num_measurements
            num_measurements = 0;
        }
    `;
    Blockly.Arduino.functionNames_["saveValues"] = `
    void saveValues() {
          // send measurements
          writeMeasurementsToSdCard(${timestamp}, ${lat}, ${lng}); 
          num_measurements = 0;
    } 
    `;
    code = "";
    code += branch;
    code += "saveValues();\n";
  }
  return code;
};

Blockly.Arduino.sensebox_sd_save_for_osem = function (block) {
  var code = "";
  var sensor_id = this.getFieldValue("SensorID");
  var id = sensor_id.slice(-3).toUpperCase();
  var sensor_value =
    Blockly.Arduino.valueToCode(block, "Value", Blockly.Arduino.ORDER_ATOMIC) ||
    '"Keine Eingabe"';
  Blockly.Arduino.definitions_["SENSOR_ID" + id + ""] =
    "const char SENSOR_ID" + id + '[] PROGMEM = "' + sensor_id + '";';
  code += "addMeasurement(SENSOR_ID" + id + "," + sensor_value + ");\n";
  console.log(code);
  return code;
};
