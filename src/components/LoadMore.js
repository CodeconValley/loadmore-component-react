/*
 * @Author: luandapeng
 * @Date: 2018-04-04 12:31:56
 * @Last Modified by: luandapeng
 * @Last Modified time: 2018-04-23 13:59:36
 */
import React from 'react';
import PropTypes from 'prop-types';
import Bind from 'lodash-decorators/bind';
import Throttle from 'lodash-decorators/throttle';
import { getScrollParent, getCurrentDistance } from '../utils/utils';
import gif from '../assets/loading.gif';

export default class LoadMore extends React.Component {
  static propTypes = {
    distance: PropTypes.number,
    onLoadMore: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    completed: PropTypes.bool,
    indicator: PropTypes.object,
  }

  static defaultProps = {
    distance: 100,
    loading: false,
    completed: false,
    indicator: {
      loading: null,
      completed: null,
    },
  }

  constructor(props) {
    super(props);
    this.el = React.createRef();
  }

  componentDidMount() {
    this.scrollParent = getScrollParent(this.el);
    this.scrollParent.addEventListener('scroll', this.scrollHandler);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.completed) {
      this.scrollParent.removeEventListener('scroll', this.scrollHandler);
    }
  }

  componentWillUnmount() {
    this.scrollParent.removeEventListener('scroll', this.scrollHandler);
  }

  checkIsInstantiation = (target) => {
    if (!React.isValidElement(target)) {
      return target;
    }
    return () => target;
  };

  @Bind()
  @Throttle(100)
  scrollHandler() {
    const { onLoadMore, distance, loading } = this.props;
    const currentDistance = getCurrentDistance(this.scrollParent);
    if (!loading && currentDistance <= distance) {
      if (onLoadMore && typeof onLoadMore === 'function') {
        onLoadMore();
      }
    }
  }

  render() {
    const { loading, completed, indicator, style } = this.props;
    const loadingStyle = {
      textAlign: 'center',
      paddingTop: 20,
      paddingBottom: 20,
      fontSize: 28,
      color: '#999',
    };
    const gifStyle = {
      width: 36,
      height: 36,
      display: 'block',
      margin: '0 auto',
    };
    const [
      Loading,
      Completed,
    ] = [
      this.checkIsInstantiation(indicator.loading),
      this.checkIsInstantiation(indicator.completed),
    ];
    return (
      <React.Fragment>
        { React.Children.only(this.props.children) }
        <div style={{ ...loadingStyle, ...style }} ref={this.el}>
          { loading && (indicator.loading ? <Loading /> : <img style={gifStyle} src={gif} alt="loading" />) }
          { !loading && completed && (indicator.completed ? <Completed /> : <span>没有了，到底了！</span>) }
        </div>
      </React.Fragment>
    );
  }
}
