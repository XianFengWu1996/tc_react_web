import React from 'react';
import Loader from 'react-loader-spinner';

const LoadingSpinner = (props) => {
  // width - default 25
  // height - default 20 
  // color is the hex code Ex. #fff   default #fff
  // type - ThreeDots, TailSpin, Rings, Puff, Oval, Hearts, Grid, Circles
  // Bars, Ball-Triangle, Audio
  return (
    <Loader
    type={props.type ? props.type : 'ThreeDots'}
    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
    color={props.color ? props.color : '#fff'}
    height={props.height ? props.height : 20}
    width={props.width ? props.width : 25}
  />
  );
};

export default LoadingSpinner;
