import classnames from 'classnames';
import {widgetSize, alertBox} from '../styles/stylesv2.css';

module.exports = function getAlertBox() {
  return `<div class="${classnames(widgetSize, alertBox)}" onclick="alert('...and boom goes the dynamite.')">I'm an alert box, yo!</div>`;
};