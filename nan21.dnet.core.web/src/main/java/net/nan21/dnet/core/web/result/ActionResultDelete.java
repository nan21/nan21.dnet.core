package net.nan21.dnet.core.web.result;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

import net.nan21.dnet.core.api.action.IActionResultDelete;

@XmlRootElement(name = "result")
@XmlAccessorType(XmlAccessType.FIELD)
public class ActionResultDelete extends AbstractResultData implements
		IActionResultDelete {

}
