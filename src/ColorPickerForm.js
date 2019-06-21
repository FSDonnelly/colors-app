import React, { Component } from 'react';
import { ChromePicker } from 'react-color';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import styles from './styles/ColorPickerFormStyles';

class ColorPickerForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentColor: "green",
            newColorName: "",
        };
    };

    componentDidMount() {
        ValidatorForm.addValidationRule('isColorNameUnique', (value) =>
            this.props.colors.every(
                ({ name }) => name.toLowerCase() !== value.toLowerCase()
            )
        );
        ValidatorForm.addValidationRule('isColorUnique', (value) =>
            this.props.colors.every(
                ({ color }) => color !== this.state.currentColor
            )
        );

    };

    updateCurrentColor = (newColor) => {
        this.setState({ currentColor: newColor.hex })
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    handleSubmit = () => {
        const newColor = {
            color: this.state.currentColor,
            name: this.state.newColorName
        };
        this.props.addNewColor(newColor);
        this.setState({ newColorName: "" })
    };

    render() {
        const { paletteIsFull, classes } = this.props;
        const { currentColor, newColorName } = this.state;
        return (
            <div>
                <ChromePicker
                    color={currentColor}
                    onChangeComplete={this.updateCurrentColor}
                    className={classes.picker}
                />
                <ValidatorForm onSubmit={this.handleSubmit} instantValidate={false}>
                    <TextValidator
                        className={classes.colorNameInput}
                        variant="filled"
                        value={newColorName}
                        margin="normal"
                        name="newColorName"
                        onChange={this.handleChange}
                        placeholder="Color Name"
                        validators={["required", "isColorNameUnique", "isColorUnique"]}
                        errorMessages={["This field is required", "Color name must be unique", "Color is already used"]}
                    />
                    <Button
                        className={classes.addColor}
                        disabled={paletteIsFull}
                        variant="contained"
                        color="primary"
                        style={{ backgroundColor: paletteIsFull ? "grey" : currentColor }}
                        type="submit"
                    >
                        {paletteIsFull ? "Palette Full" : "Add Color"}
                    </Button>
                </ValidatorForm>
            </div>
        )
    }
}
export default withStyles(styles)(ColorPickerForm);