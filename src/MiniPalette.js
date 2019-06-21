import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import styles from './styles/MiniPaletteStyles';

class MiniPalette extends Component {
    // constructor(props) {
    //     super(props);
    // };

    deletePalette = (e) => {
        e.stopPropagation();
        this.props.handleDelete(this.props.id);
    };

    render() {
        const { classes, paletteName, emoji, colors, handleClick } = this.props;
        const miniColorBoxes = colors.map(color => (
            <div className={classes.miniColor} key={color.name} style={{ backgroundColor: color.color }}></div>
        ))
        return (
            <div className={classes.root} onClick={handleClick}>
                <DeleteIcon
                    className={classes.deleteIcon}
                    onClick={this.deletePalette}
                />
                <div className={classes.colors}>
                    {miniColorBoxes}
                </div>
                <h5 className={classes.title}>{paletteName} <span className={classes.emoji}>{emoji}</span></h5>
            </div>
        );
    }
}
export default withStyles(styles)(MiniPalette);
