
let sysDiskTypes = [
  {
    label: "高效云盘",
    value: "cloud_efficiency",
  },
  {
    label: "普通云盘",
    value: "cloud",
  },
  {
    label: "SSD云盘",
    value: "cloud_ssd",
  },
  {
    label: "本地SSD",
    value: "ephemeral_ssd",
  },
]

let dataDiskTypes = [
  {
    label: "无",
    value: null,
  },
  ...sysDiskTypes,
]

/* v----- Do not change anything between here
 *       (the DRIVERNAME placeholder will be automatically replaced during build) */
define('ui/components/machine/driver-%%DRIVERNAME%%/component', ['exports', 'ember', 'ui/mixins/driver'], function (exports, _ember, _uiMixinsDriver) {

  exports['default'] = _ember['default'].Component.extend(_uiMixinsDriver['default'], {
    driverName: '%%DRIVERNAME%%',
    /* ^--- And here */
    model: null,
    config: Ember.computed.alias('model.%%DRIVERNAME%%Config'),
    publicIP: false,
    sysDiskTypes: sysDiskTypes,
    dataDiskTypes: dataDiskTypes,

    // Write your component here, starting with setting 'model' to a machine with your config populated
    bootstrap: function () {
      let config = this.get('store').createRecord({
        type: '%%DRIVERNAME%%Config',
        instanceType: "ecs.n1.small",
        ioOptimized: true,
        diskCategory: null,
        diskSize: 100,
        region: "cn-shanghai",
        zone: "cn-shanghai-b",
        privateAddressOnly: true,
        upgradeKernel: true,
      });

      this.set('model', this.get('store').createRecord({
        type: 'machine',
        '%%DRIVERNAME%%Config': config,
      }));
    },

    // Add custom validation beyond what can be done from the config API schema
    validate: function () {
      let errors = [];

      if (!this.get('config.accessKeyId')) {
        errors.push('Access Key is required');
      }

      if (!this.get('config.accessKeySecret')) {
        errors.push('Access Key Secret is requried');
      }

      if (errors.length) {
        this.set('errors', errors.uniq());
        return false;
      }

      return true;
    },

    // Any computed properties or custom logic can go here
    willSave: function () {
      let validate = this._super(...arguments);

      if (validate) {
        if (!this.get('config.diskCategory')) {
          this.set('config.diskSize', 0);
        }
        if (this.publicIP) {
          this.set('config.privateAddressOnly', false)
        }
        return validate;
      } else {
        return validate;
      }
    },

  });
});
