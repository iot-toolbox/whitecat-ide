/*
 * Whitecat Blocky Environment, events block code generation
 *
 * Copyright (C) 2015 - 2016
 * IBEROXARXA SERVICIOS INTEGRALES, S.L. & CSS IBÉRICA, S.L.
 * 
 * Author: Jaume Olivé (jolive@iberoxarxa.com / jolive@whitecatboard.org)
 * 
 * All rights reserved.  
 *
 * Permission to use, copy, modify, and distribute this software
 * and its documentation for any purpose and without fee is hereby
 * granted, provided that the above copyright notice appear in all
 * copies and that both that the copyright notice and this
 * permission notice and warranty disclaimer appear in supporting
 * documentation, and that the name of the author not be used in
 * advertising or publicity pertaining to distribution of the
 * software without specific, written prior permission.
 *
 * The author disclaim all warranties with regard to this
 * software, including all implied warranties of merchantability
 * and fitness.  In no event shall the author be liable for any
 * special, indirect or consequential damages or any damages
 * whatsoever resulting from loss of use, data or profits, whether
 * in an action of contract, negligence or other tortious action,
 * arising out of or in connection with the use or performance of
 * this software.
 */
'use strict';

goog.provide('Blockly.Lua.events');

goog.require('Blockly.Lua');

Blockly.Lua['when_board_starts'] = function(block) {
    var code = '';
	var doStatement = Blockly.Lua.statementToCode(block, 'DO');

	code = 'thread.start(function()\n';
	code += doStatement;
	code += "end)\n";

	return code;
}

Blockly.Lua['when_i_receive'] = function(block) {
    var code = '';
	var doStatement = Blockly.Lua.statementToCode(block, 'DO');
	var when = block.getFieldValue('WHEN');

	var eventId = this.workspace.eventIndexOf(when);
	
	code  = 'if (_event' + eventId + ' == nil) then\n';
	code += Blockly.Lua.prefixLines('_event' + eventId + ' = event.create()\n', Blockly.Lua.INDENT);
	code += 'end\n';
	code += '_event' + eventId + ':addlistener(function()\n';
	code += Blockly.Lua.prefixLines('thread.start(function()', Blockly.Lua.INDENT);
	code += Blockly.Lua.prefixLines(doStatement, Blockly.Lua.INDENT);
	code += Blockly.Lua.prefixLines("end)\n", Blockly.Lua.INDENT);
	code += "end)\n";		

	return code;
}

Blockly.Lua['when_i_receive_a_lora_frame'] = function(block) {
    var code = '';
	var doStatement = Blockly.Lua.statementToCode(block, 'DO');

	code = 'lora.whenReceived(function(_port, _payload)\n';
	code += doStatement;
	code += "end)\n";

	return code;
}

Blockly.Lua['broadcast'] = function(block) {
    var code = '';
	var when = block.getFieldValue('WHEN');
	var eventId = this.workspace.eventIndexOf(when);

	code += '_event' + eventId + ':broadcast(false)\n';

	return code;
}

Blockly.Lua['broadcast_and_wait'] = function(block) {
    var code = '';
	var when = block.getFieldValue('WHEN');
	var eventId = this.workspace.eventIndexOf(when);

	code += '_event' + eventId + ':broadcast(true)\n';

	return code;
}