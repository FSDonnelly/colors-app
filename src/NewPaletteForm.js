import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { Button } from '@material-ui/core';
import arrayMove from 'array-move';

import styles from './styles/NewPaletteFormStyles';
import DraggableColorList from './DraggableColorList';
import PaletteFormNav from './PaletteFormNav';
import ColorPickerForm from './ColorPickerForm';



class NewPaletteForm extends Component {
    static defaultProps = {
        maxColors: 20
    };

    constructor(props) {
        super(props);
        this.state = {
            open: true,
            colors: this.props.palettes[0].colors,
        };
    };

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    addNewColor = (newColor) => {
        this.setState({ colors: [...this.state.colors, newColor], newColorName: "" })
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    clearColors = () => {
        this.setState({ colors: [] })
    };

    addRandomColor = () => {
        const allColors = this.props.palettes.map(p => p.colors).flat();
        var rand = Math.floor(Math.random() * allColors.length);
        const randomColor = allColors[rand];
        this.setState({ colors: [...this.state.colors, randomColor] });
    };

    handleSubmit = (newPalette) => {
        newPalette.id = newPalette.paletteName.toLowerCase().replace(/ /g, "-");
        newPalette.colors = this.state.colors;
        this.props.savePalette(newPalette);
        this.props.history.push("/")
    };

    removeColor = (colorName) => {
        this.setState({
            colors: this.state.colors.filter(color => color.name !== colorName)
        })
    };

    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState(({ colors }) => ({
            colors: arrayMove(colors, oldIndex, newIndex),
        }));
    };

    render() {
        const { classes, maxColors, palettes } = this.props;
        const { colors, open } = this.state;
        const paletteIsFull = colors.length >= maxColors;

        return (
            <div className={classes.root}>
                <PaletteFormNav
                    open={open}
                    palettes={palettes}
                    handleSubmit={this.handleSubmit}
                    handleDrawerOpen={this.handleDrawerOpen}
                />
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={this.handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    <div className={classes.container}>
                        <Typography variant="h4" gutterBottom>
                            Design Your Palette
                    </Typography>
                        <div className={classes.buttons}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={this.clearColors}
                                className={classes.button}
                            >
                                Clear Palette
                    </Button>
                            <Button
                                className={classes.button}
                                disabled={paletteIsFull}
                                variant="contained"
                                color="primary"
                                onClick={this.addRandomColor}>
                                Random Color
                    </Button>
                        </div>
                        <ColorPickerForm
                            paletteIsFull={paletteIsFull}
                            addNewColor={this.addNewColor}
                            colors={colors}
                        />
                    </div>
                </Drawer>
                <main
                    className={classNames(classes.content, {
                        [classes.contentShift]: open,
                    })}
                >
                    <div className={classes.drawerHeader} />
                    <DraggableColorList
                        colors={colors}
                        removeColor={this.removeColor}
                        axis="xy"
                        onSortEnd={this.onSortEnd}
                        distance={10}
                    />
                </main>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(NewPaletteForm);