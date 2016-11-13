import {post} from '../lib/api/fetch'; 
import {Action} from 'redux';
import {getFacebookToken} from '../lib/auth';
import * as events from '../lib/api/events';

export const UPDATE_EVENTS = 'UPDATE_EVENTS'; 


export interface EventsAction extends Action {
  events: Checkpoints.Event[];
} 

export function getEvents(search: Checkpoints.eventSearch) {
  return dispatch => {
    return events.getEvents(search).then(events => {
      dispatch(updateEvents(events));
    });
  }
}

function updateEvents (events: Checkpoints.Event[]) {
  return {
    type: UPDATE_EVENTS,
    events
  }
}