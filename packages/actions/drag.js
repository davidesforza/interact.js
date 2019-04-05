import { ActionName } from '@interactjs/core/scope';
import * as arr from '@interactjs/utils/arr';
import * as is from '@interactjs/utils/is';
ActionName.Drag = 'drag';
function install(scope) {
    const { actions, Interactable, interactions, defaults, } = scope;
    interactions.signals.on('before-action-move', beforeMove);
    interactions.signals.on('action-resume', beforeMove);
    // dragmove
    interactions.signals.on('action-move', move);
    Interactable.prototype.draggable = drag.draggable;
    actions[ActionName.Drag] = drag;
    actions.names.push(ActionName.Drag);
    arr.merge(actions.eventTypes, [
        'dragstart',
        'dragmove',
        'draginertiastart',
        'dragresume',
        'dragend',
    ]);
    actions.methodDict.drag = 'draggable';
    defaults.actions.drag = drag.defaults;
}
function beforeMove({ interaction }) {
    if (interaction.prepared.name !== 'drag') {
        return;
    }
    const axis = interaction.prepared.axis;
    if (axis === 'x') {
        interaction.coords.cur.page.y = interaction.coords.start.page.y;
        interaction.coords.cur.client.y = interaction.coords.start.client.y;
        interaction.coords.velocity.client.y = 0;
        interaction.coords.velocity.page.y = 0;
    }
    else if (axis === 'y') {
        interaction.coords.cur.page.x = interaction.coords.start.page.x;
        interaction.coords.cur.client.x = interaction.coords.start.client.x;
        interaction.coords.velocity.client.x = 0;
        interaction.coords.velocity.page.x = 0;
    }
}
function move({ iEvent, interaction }) {
    if (interaction.prepared.name !== 'drag') {
        return;
    }
    const axis = interaction.prepared.axis;
    if (axis === 'x' || axis === 'y') {
        const opposite = axis === 'x' ? 'y' : 'x';
        iEvent.page[opposite] = interaction.coords.start.page[opposite];
        iEvent.client[opposite] = interaction.coords.start.client[opposite];
        iEvent.delta[opposite] = 0;
    }
}
/**
 * ```js
 * interact(element).draggable({
 *     onstart: function (event) {},
 *     onmove : function (event) {},
 *     onend  : function (event) {},
 *
 *     // the axis in which the first movement must be
 *     // for the drag sequence to start
 *     // 'xy' by default - any direction
 *     startAxis: 'x' || 'y' || 'xy',
 *
 *     // 'xy' by default - don't restrict to one axis (move in any direction)
 *     // 'x' or 'y' to restrict movement to either axis
 *     // 'start' to restrict movement to the axis the drag started in
 *     lockAxis: 'x' || 'y' || 'xy' || 'start',
 *
 *     // max number of drags that can happen concurrently
 *     // with elements of this Interactable. Infinity by default
 *     max: Infinity,
 *
 *     // max number of drags that can target the same element+Interactable
 *     // 1 by default
 *     maxPerElement: 2
 * });
 *
 * var isDraggable = interact('element').draggable(); // true
 * ```
 *
 * Get or set whether drag actions can be performed on the target
 *
 * @alias Interactable.prototype.draggable
 *
 * @param {boolean | object} [options] true/false or An object with event
 * listeners to be fired on drag events (object makes the Interactable
 * draggable)
 * @return {boolean | Interactable} boolean indicating if this can be the
 * target of drag events, or this Interctable
 */
const draggable = function draggable(options) {
    if (is.object(options)) {
        this.options.drag.enabled = options.enabled !== false;
        this.setPerAction('drag', options);
        this.setOnEvents('drag', options);
        if (/^(xy|x|y|start)$/.test(options.lockAxis)) {
            this.options.drag.lockAxis = options.lockAxis;
        }
        if (/^(xy|x|y)$/.test(options.startAxis)) {
            this.options.drag.startAxis = options.startAxis;
        }
        return this;
    }
    if (is.bool(options)) {
        this.options.drag.enabled = options;
        return this;
    }
    return this.options.drag;
};
const drag = {
    id: 'actions/drag',
    install,
    draggable,
    beforeMove,
    move,
    defaults: {
        startAxis: 'xy',
        lockAxis: 'xy',
    },
    checker(_pointer, _event, interactable) {
        const dragOptions = interactable.options.drag;
        return dragOptions.enabled
            ? {
                name: 'drag',
                axis: (dragOptions.lockAxis === 'start'
                    ? dragOptions.startAxis
                    : dragOptions.lockAxis),
            }
            : null;
    },
    getCursor() {
        return 'move';
    },
};
export default drag;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRyYWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBUyxNQUFNLHdCQUF3QixDQUFBO0FBQzFELE9BQU8sS0FBSyxHQUFHLE1BQU0sdUJBQXVCLENBQUE7QUFDNUMsT0FBTyxLQUFLLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQTtBQXlCekMsVUFBa0IsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFBO0FBTWpDLFNBQVMsT0FBTyxDQUFFLEtBQVk7SUFDNUIsTUFBTSxFQUNKLE9BQU8sRUFDUCxZQUFZLEVBQ1osWUFBWSxFQUNaLFFBQVEsR0FDVCxHQUFHLEtBQUssQ0FBQTtJQUVULFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLFVBQVUsQ0FBQyxDQUFBO0lBQ3pELFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxVQUFVLENBQUMsQ0FBQTtJQUVwRCxXQUFXO0lBQ1gsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFBO0lBRTVDLFlBQVksQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUE7SUFFakQsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUE7SUFDL0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ25DLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRTtRQUM1QixXQUFXO1FBQ1gsVUFBVTtRQUNWLGtCQUFrQjtRQUNsQixZQUFZO1FBQ1osU0FBUztLQUNWLENBQUMsQ0FBQTtJQUNGLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQTtJQUVyQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksR0FB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QUM7YUFDMUI7WUFDRCxDQUFDLENBQUMsSUFBSSxDQUFBO0lBQ1YsQ0FBQztJQUVELFNBQVM7UUFDUCxPQUFPLE1BQU0sQ0FBQTtJQUNmLENBQUM7Q0FDRixDQUFBO0FBRUQsZUFBZSxJQUFJLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3Rpb25OYW1lLCBTY29wZSB9IGZyb20gJ0BpbnRlcmFjdGpzL2NvcmUvc2NvcGUnXG5pbXBvcnQgKiBhcyBhcnIgZnJvbSAnQGludGVyYWN0anMvdXRpbHMvYXJyJ1xuaW1wb3J0ICogYXMgaXMgZnJvbSAnQGludGVyYWN0anMvdXRpbHMvaXMnXG5cbmRlY2xhcmUgbW9kdWxlICdAaW50ZXJhY3Rqcy9jb3JlL0ludGVyYWN0YWJsZScge1xuICBpbnRlcmZhY2UgSW50ZXJhY3RhYmxlIHtcbiAgICBkcmFnZ2FibGU6IERyYWdnYWJsZU1ldGhvZFxuICB9XG59XG5cbmRlY2xhcmUgbW9kdWxlICdAaW50ZXJhY3Rqcy9jb3JlL2RlZmF1bHRPcHRpb25zJyB7XG4gIGludGVyZmFjZSBBY3Rpb25EZWZhdWx0cyB7XG4gICAgZHJhZzogSW50ZXJhY3QuRHJhZ2dhYmxlT3B0aW9uc1xuICB9XG59XG5cbmRlY2xhcmUgbW9kdWxlICdAaW50ZXJhY3Rqcy9jb3JlL3Njb3BlJyB7XG4gIGludGVyZmFjZSBBY3Rpb25zIHtcbiAgICBbQWN0aW9uTmFtZS5EcmFnXT86IHR5cGVvZiBkcmFnXG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2hhZG93XG4gIGVudW0gQWN0aW9uTmFtZSB7XG4gICAgRHJhZyA9ICdkcmFnJ1xuICB9XG59XG5cbihBY3Rpb25OYW1lIGFzIGFueSkuRHJhZyA9ICdkcmFnJ1xuXG5leHBvcnQgdHlwZSBEcmFnRXZlbnQgPSBJbnRlcmFjdC5JbnRlcmFjdEV2ZW50PEFjdGlvbk5hbWUuRHJhZz5cblxuZXhwb3J0IHR5cGUgRHJhZ2dhYmxlTWV0aG9kID0gSW50ZXJhY3QuQWN0aW9uTWV0aG9kPEludGVyYWN0LkRyYWdnYWJsZU9wdGlvbnM+XG5cbmZ1bmN0aW9uIGluc3RhbGwgKHNjb3BlOiBTY29wZSkge1xuICBjb25zdCB7XG4gICAgYWN0aW9ucyxcbiAgICBJbnRlcmFjdGFibGUsXG4gICAgaW50ZXJhY3Rpb25zLFxuICAgIGRlZmF1bHRzLFxuICB9ID0gc2NvcGVcblxuICBpbnRlcmFjdGlvbnMuc2lnbmFscy5vbignYmVmb3JlLWFjdGlvbi1tb3ZlJywgYmVmb3JlTW92ZSlcbiAgaW50ZXJhY3Rpb25zLnNpZ25hbHMub24oJ2FjdGlvbi1yZXN1bWUnLCBiZWZvcmVNb3ZlKVxuXG4gIC8vIGRyYWdtb3ZlXG4gIGludGVyYWN0aW9ucy5zaWduYWxzLm9uKCdhY3Rpb24tbW92ZScsIG1vdmUpXG5cbiAgSW50ZXJhY3RhYmxlLnByb3RvdHlwZS5kcmFnZ2FibGUgPSBkcmFnLmRyYWdnYWJsZVxuXG4gIGFjdGlvbnNbQWN0aW9uTmFtZS5EcmFnXSA9IGRyYWdcbiAgYWN0aW9ucy5uYW1lcy5wdXNoKEFjdGlvbk5hbWUuRHJhZylcbiAgYXJyLm1lcmdlKGFjdGlvbnMuZXZlbnRUeXBlcywgW1xuICAgICdkcmFnc3RhcnQnLFxuICAgICdkcmFnbW92ZScsXG4gICAgJ2RyYWdpbmVydGlhc3RhcnQnLFxuICAgICdkcmFncmVzdW1lJyxcbiAgICAnZHJhZ2VuZCcsXG4gIF0pXG4gIGFjdGlvbnMubWV0aG9kRGljdC5kcmFnID0gJ2RyYWdnYWJsZSdcblxuICBkZWZhdWx0cy5hY3Rpb25zLmRyYWcgPSBkcmFnLmRlZmF1bHRzXG59XG5cbmZ1bmN0aW9uIGJlZm9yZU1vdmUgKHsgaW50ZXJhY3Rpb24gfSkge1xuICBpZiAoaW50ZXJhY3Rpb24ucHJlcGFyZWQubmFtZSAhPT0gJ2RyYWcnKSB7IHJldHVybiB9XG5cbiAgY29uc3QgYXhpcyA9IGludGVyYWN0aW9uLnByZXBhcmVkLmF4aXNcblxuICBpZiAoYXhpcyA9PT0gJ3gnKSB7XG4gICAgaW50ZXJhY3Rpb24uY29vcmRzLmN1ci5wYWdlLnkgICA9IGludGVyYWN0aW9uLmNvb3Jkcy5zdGFydC5wYWdlLnlcbiAgICBpbnRlcmFjdGlvbi5jb29yZHMuY3VyLmNsaWVudC55ID0gaW50ZXJhY3Rpb24uY29vcmRzLnN0YXJ0LmNsaWVudC55XG5cbiAgICBpbnRlcmFjdGlvbi5jb29yZHMudmVsb2NpdHkuY2xpZW50LnkgPSAwXG4gICAgaW50ZXJhY3Rpb24uY29vcmRzLnZlbG9jaXR5LnBhZ2UueSAgID0gMFxuICB9XG4gIGVsc2UgaWYgKGF4aXMgPT09ICd5Jykge1xuICAgIGludGVyYWN0aW9uLmNvb3Jkcy5jdXIucGFnZS54ICAgPSBpbnRlcmFjdGlvbi5jb29yZHMuc3RhcnQucGFnZS54XG4gICAgaW50ZXJhY3Rpb24uY29vcmRzLmN1ci5jbGllbnQueCA9IGludGVyYWN0aW9uLmNvb3Jkcy5zdGFydC5jbGllbnQueFxuXG4gICAgaW50ZXJhY3Rpb24uY29vcmRzLnZlbG9jaXR5LmNsaWVudC54ID0gMFxuICAgIGludGVyYWN0aW9uLmNvb3Jkcy52ZWxvY2l0eS5wYWdlLnggICA9IDBcbiAgfVxufVxuXG5mdW5jdGlvbiBtb3ZlICh7IGlFdmVudCwgaW50ZXJhY3Rpb24gfSkge1xuICBpZiAoaW50ZXJhY3Rpb24ucHJlcGFyZWQubmFtZSAhPT0gJ2RyYWcnKSB7IHJldHVybiB9XG5cbiAgY29uc3QgYXhpcyA9IGludGVyYWN0aW9uLnByZXBhcmVkLmF4aXNcblxuICBpZiAoYXhpcyA9PT0gJ3gnIHx8IGF4aXMgPT09ICd5Jykge1xuICAgIGNvbnN0IG9wcG9zaXRlID0gYXhpcyA9PT0gJ3gnID8gJ3knIDogJ3gnXG5cbiAgICBpRXZlbnQucGFnZVtvcHBvc2l0ZV0gICA9IGludGVyYWN0aW9uLmNvb3Jkcy5zdGFydC5wYWdlW29wcG9zaXRlXVxuICAgIGlFdmVudC5jbGllbnRbb3Bwb3NpdGVdID0gaW50ZXJhY3Rpb24uY29vcmRzLnN0YXJ0LmNsaWVudFtvcHBvc2l0ZV1cbiAgICBpRXZlbnQuZGVsdGFbb3Bwb3NpdGVdID0gMFxuICB9XG59XG5cbi8qKlxuICogYGBganNcbiAqIGludGVyYWN0KGVsZW1lbnQpLmRyYWdnYWJsZSh7XG4gKiAgICAgb25zdGFydDogZnVuY3Rpb24gKGV2ZW50KSB7fSxcbiAqICAgICBvbm1vdmUgOiBmdW5jdGlvbiAoZXZlbnQpIHt9LFxuICogICAgIG9uZW5kICA6IGZ1bmN0aW9uIChldmVudCkge30sXG4gKlxuICogICAgIC8vIHRoZSBheGlzIGluIHdoaWNoIHRoZSBmaXJzdCBtb3ZlbWVudCBtdXN0IGJlXG4gKiAgICAgLy8gZm9yIHRoZSBkcmFnIHNlcXVlbmNlIHRvIHN0YXJ0XG4gKiAgICAgLy8gJ3h5JyBieSBkZWZhdWx0IC0gYW55IGRpcmVjdGlvblxuICogICAgIHN0YXJ0QXhpczogJ3gnIHx8ICd5JyB8fCAneHknLFxuICpcbiAqICAgICAvLyAneHknIGJ5IGRlZmF1bHQgLSBkb24ndCByZXN0cmljdCB0byBvbmUgYXhpcyAobW92ZSBpbiBhbnkgZGlyZWN0aW9uKVxuICogICAgIC8vICd4JyBvciAneScgdG8gcmVzdHJpY3QgbW92ZW1lbnQgdG8gZWl0aGVyIGF4aXNcbiAqICAgICAvLyAnc3RhcnQnIHRvIHJlc3RyaWN0IG1vdmVtZW50IHRvIHRoZSBheGlzIHRoZSBkcmFnIHN0YXJ0ZWQgaW5cbiAqICAgICBsb2NrQXhpczogJ3gnIHx8ICd5JyB8fCAneHknIHx8ICdzdGFydCcsXG4gKlxuICogICAgIC8vIG1heCBudW1iZXIgb2YgZHJhZ3MgdGhhdCBjYW4gaGFwcGVuIGNvbmN1cnJlbnRseVxuICogICAgIC8vIHdpdGggZWxlbWVudHMgb2YgdGhpcyBJbnRlcmFjdGFibGUuIEluZmluaXR5IGJ5IGRlZmF1bHRcbiAqICAgICBtYXg6IEluZmluaXR5LFxuICpcbiAqICAgICAvLyBtYXggbnVtYmVyIG9mIGRyYWdzIHRoYXQgY2FuIHRhcmdldCB0aGUgc2FtZSBlbGVtZW50K0ludGVyYWN0YWJsZVxuICogICAgIC8vIDEgYnkgZGVmYXVsdFxuICogICAgIG1heFBlckVsZW1lbnQ6IDJcbiAqIH0pO1xuICpcbiAqIHZhciBpc0RyYWdnYWJsZSA9IGludGVyYWN0KCdlbGVtZW50JykuZHJhZ2dhYmxlKCk7IC8vIHRydWVcbiAqIGBgYFxuICpcbiAqIEdldCBvciBzZXQgd2hldGhlciBkcmFnIGFjdGlvbnMgY2FuIGJlIHBlcmZvcm1lZCBvbiB0aGUgdGFyZ2V0XG4gKlxuICogQGFsaWFzIEludGVyYWN0YWJsZS5wcm90b3R5cGUuZHJhZ2dhYmxlXG4gKlxuICogQHBhcmFtIHtib29sZWFuIHwgb2JqZWN0fSBbb3B0aW9uc10gdHJ1ZS9mYWxzZSBvciBBbiBvYmplY3Qgd2l0aCBldmVudFxuICogbGlzdGVuZXJzIHRvIGJlIGZpcmVkIG9uIGRyYWcgZXZlbnRzIChvYmplY3QgbWFrZXMgdGhlIEludGVyYWN0YWJsZVxuICogZHJhZ2dhYmxlKVxuICogQHJldHVybiB7Ym9vbGVhbiB8IEludGVyYWN0YWJsZX0gYm9vbGVhbiBpbmRpY2F0aW5nIGlmIHRoaXMgY2FuIGJlIHRoZVxuICogdGFyZ2V0IG9mIGRyYWcgZXZlbnRzLCBvciB0aGlzIEludGVyY3RhYmxlXG4gKi9cbmNvbnN0IGRyYWdnYWJsZTogRHJhZ2dhYmxlTWV0aG9kID0gZnVuY3Rpb24gZHJhZ2dhYmxlICh0aGlzOiBJbnRlcmFjdC5JbnRlcmFjdGFibGUsIG9wdGlvbnM/OiBJbnRlcmFjdC5EcmFnZ2FibGVPcHRpb25zIHwgYm9vbGVhbik6IGFueSB7XG4gIGlmIChpcy5vYmplY3Qob3B0aW9ucykpIHtcbiAgICB0aGlzLm9wdGlvbnMuZHJhZy5lbmFibGVkID0gb3B0aW9ucy5lbmFibGVkICE9PSBmYWxzZVxuICAgIHRoaXMuc2V0UGVyQWN0aW9uKCdkcmFnJywgb3B0aW9ucylcbiAgICB0aGlzLnNldE9uRXZlbnRzKCdkcmFnJywgb3B0aW9ucylcblxuICAgIGlmICgvXih4eXx4fHl8c3RhcnQpJC8udGVzdChvcHRpb25zLmxvY2tBeGlzKSkge1xuICAgICAgdGhpcy5vcHRpb25zLmRyYWcubG9ja0F4aXMgPSBvcHRpb25zLmxvY2tBeGlzXG4gICAgfVxuICAgIGlmICgvXih4eXx4fHkpJC8udGVzdChvcHRpb25zLnN0YXJ0QXhpcykpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5kcmFnLnN0YXJ0QXhpcyA9IG9wdGlvbnMuc3RhcnRBeGlzXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIGlmIChpcy5ib29sKG9wdGlvbnMpKSB7XG4gICAgdGhpcy5vcHRpb25zLmRyYWcuZW5hYmxlZCA9IG9wdGlvbnNcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICByZXR1cm4gdGhpcy5vcHRpb25zLmRyYWdcbn1cblxuY29uc3QgZHJhZzogSW50ZXJhY3QuUGx1Z2luID0ge1xuICBpZDogJ2FjdGlvbnMvZHJhZycsXG4gIGluc3RhbGwsXG4gIGRyYWdnYWJsZSxcbiAgYmVmb3JlTW92ZSxcbiAgbW92ZSxcbiAgZGVmYXVsdHM6IHtcbiAgICBzdGFydEF4aXMgOiAneHknLFxuICAgIGxvY2tBeGlzICA6ICd4eScsXG4gIH0gYXMgSW50ZXJhY3QuRHJvcHpvbmVPcHRpb25zLFxuXG4gIGNoZWNrZXIgKF9wb2ludGVyLCBfZXZlbnQsIGludGVyYWN0YWJsZSkge1xuICAgIGNvbnN0IGRyYWdPcHRpb25zID0gaW50ZXJhY3RhYmxlLm9wdGlvbnMuZHJhZ1xuXG4gICAgcmV0dXJuIGRyYWdPcHRpb25zLmVuYWJsZWRcbiAgICAgID8ge1xuICAgICAgICBuYW1lOiAnZHJhZycsXG4gICAgICAgIGF4aXM6IChkcmFnT3B0aW9ucy5sb2NrQXhpcyA9PT0gJ3N0YXJ0J1xuICAgICAgICAgID8gZHJhZ09wdGlvbnMuc3RhcnRBeGlzXG4gICAgICAgICAgOiBkcmFnT3B0aW9ucy5sb2NrQXhpcyksXG4gICAgICB9XG4gICAgICA6IG51bGxcbiAgfSxcblxuICBnZXRDdXJzb3IgKCkge1xuICAgIHJldHVybiAnbW92ZSdcbiAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgZHJhZ1xuIl19