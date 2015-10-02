/* @flow */

export default function createAdaptorShape(PropTypes) {
  return PropTypes.shape({
    selectState: PropTypes.func.isRequired,
    performQuery: PropTypes.func.isRequired,
    performMutation: PropTypes.func.isRequired
  });
}
