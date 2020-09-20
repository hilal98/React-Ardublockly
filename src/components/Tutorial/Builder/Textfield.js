import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { tutorialTitle, jsonString, changeContent, setError, deleteError } from '../../../actions/tutorialBuilderActions';

import { withStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

const styles = theme => ({
  multiline: {
    padding: '18.5px 14px 18.5px 24px'
  },
  errorColor: {
    color: theme.palette.error.dark
  }
});

class Textfield extends Component {

  handleChange = (e) => {
    var value = e.target.value;
    if(this.props.property === 'title'){
      this.props.tutorialTitle(value);
    }
    else if(this.props.property === 'json'){
      this.props.jsonString(value);
    }
    else {
      this.props.changeContent(this.props.index, this.props.property, value);
    }
    if(value.replace(/\s/g,'') === ''){
      this.props.setError(this.props.index, this.props.property);
    }
    else{
      this.props.deleteError(this.props.index, this.props.property);
    }
  };

  render() {
    return (
      <FormControl variant="outlined" fullWidth style={{marginBottom: '10px'}}>
        <InputLabel htmlFor={this.props.property}>{this.props.label}</InputLabel>
        <OutlinedInput
          style={{borderRadius: '25px'}}
          classes={{multiline: this.props.classes.multiline}}
          error={this.props.index !== undefined ? this.props.error.steps[this.props.index][this.props.property] : this.props.error[this.props.property]}
          value={this.props.value}
          label={this.props.label}
          id={this.props.property}
          multiline={this.props.multiline}
          rows={2}
          rowsMax={10}
          onChange={(e) => this.handleChange(e)}
        />
        {this.props.index !== undefined ?
          this.props.error.steps[this.props.index][this.props.property] ? <FormHelperText className={this.props.classes.errorColor}>{this.props.errorText}</FormHelperText>
        : null
        : this.props.error[this.props.property] ?
            this.props.property === 'title' ? <FormHelperText className={this.props.classes.errorColor}>Gib einen Titel für das Tutorial ein.</FormHelperText>
                                            : <FormHelperText className={this.props.classes.errorColor}>Gib einen JSON-String ein und bestätige diesen mit einem Klick auf den entsprechenden Button</FormHelperText>
        : null}
      </FormControl>
    );
  };
}

Textfield.propTypes = {
  tutorialTitle: PropTypes.func.isRequired,
  jsonString: PropTypes.func.isRequired,
  changeContent: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired,
  change: PropTypes.number.isRequired
};

const mapStateToProps = state => ({
  error: state.builder.error,
  change: state.builder.change
});

export default connect(mapStateToProps, { tutorialTitle, jsonString, changeContent, setError, deleteError })(withStyles(styles, { withTheme: true })(Textfield));
