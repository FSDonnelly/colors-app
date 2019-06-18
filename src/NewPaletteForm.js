import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { ChromePicker } from 'react-color';
import { Button } from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import arrayMove from 'array-move';

import DraggableColorList from './DraggableColorList';
import PaletteFormNav from './PaletteFormNav';

const drawerWidth = 400;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        height: "calc(100vh - 64px)",
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
});

class NewPaletteForm extends Component {
    static defaultProps = {
        maxColors: 20
    };

    constructor(props) {
        super(props);
        this.state = {
            open: true,
            currentColor: "green",
            newColorName: "",
            colors: this.props.palettes[0].colors,
        };
    };

    componentDidMount() {
        ValidatorForm.addValidationRule('isColorNameUnique', (value) =>
            this.state.colors.every(
                ({ name }) => name.toLowerCase() !== value.toLowerCase()
            )
        );
        ValidatorForm.addValidationRule('isColorUnique', (value) =>
            this.state.colors.every(
                ({ color }) => color !== this.state.currentColor
            )
        );

    };

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    updateCurrentColor = (newColor) => {
        this.setState({ currentColor: newColor.hex })
    };

    addNewColor = () => {
        const newColor = { color: this.state.currentColor, name: this.state.newColorName };
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

    handleSubmit = (newPaletteName) => {
        const newPalette = {
            paletteName: newPaletteName,
            id: newPaletteName.toLowerCase().replace(/ /g, "-"),
            colors: this.state.colors
        };
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
        const { colors, open, currentColor, newColorName } = this.state;
        const paletteIsFull = colors.length >= maxColors;

        return (
            <div className={classes.root}>
                <PaletteFormNav
                    open={open}
                    classes={classes}
                    palettes={palettes}
                    handleSubmit={this.handleSubmit}
                    handleDrawerOpen={this.handleDrawerOpen}
                />
                {/* <CssBaseline />
                <AppBar
                    position="fixed"
                    color="default"
                    className={classNames(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar disableGutters={!open}>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerOpen}
                            className={classNames(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" noWrap>
                            Persistent drawer
                </Typography>
                        <ValidatorForm onSubmit={this.handleSubmit}>
                            <TextValidator
                                label="Palette Name"
                                onChange={this.handleChange}
                                value={this.state.newPaletteName}
                                name="newPaletteName"
                                validators={["required", "isPaletteNameUnique"]}
                                errorMessages={["Enter Palette Name", "Name already used"]}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                Save Palette
                            </Button>
                            <Link to="/">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                >
                                    Go Back
                                </Button>
                            </Link>
                        </ValidatorForm>
                    </Toolbar>
                </AppBar> */}
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
                    <Typography variant="h4">
                        Design Your Palette
                    </Typography>
                    <div>
                        <Button variant="contained" color="secondary" onClick={this.clearColors}>
                            Clear Palette
                    </Button>
                        <Button disabled={paletteIsFull} variant="contained" color="primary" onClick={this.addRandomColor}>
                            Random Color
                    </Button>
                    </div>
                    <ChromePicker color={currentColor} onChangeComplete={this.updateCurrentColor} />
                    <ValidatorForm onSubmit={this.addNewColor} instantValidate={false}>
                        <TextValidator
                            value={newColorName}
                            name="newColorName"
                            onChange={this.handleChange}
                            validators={["required", "isColorNameUnique", "isColorUnique"]}
                            errorMessages={["This field is required", "Color name must be unique", "Color is already used"]}
                        />
                        <Button
                            disabled={paletteIsFull}
                            variant="contained"
                            color="primary"
                            style={{ backgroundColor: paletteIsFull ? "grey" : currentColor }}
                            type="submit"
                        >
                            {paletteIsFull ? "Palette Full" : "Add Color"}
                        </Button>
                    </ValidatorForm>
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
                    />
                </main>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(NewPaletteForm);