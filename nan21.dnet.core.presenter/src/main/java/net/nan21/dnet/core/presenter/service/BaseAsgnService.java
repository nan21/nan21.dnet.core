package net.nan21.dnet.core.presenter.service;

import net.nan21.dnet.core.api.service.IAsgnService;

import org.springframework.transaction.annotation.Transactional;
 
@Transactional
public class BaseAsgnService<M,P,E> extends AbstractAsgnService<M,P,E>
		implements IAsgnService<M,P>{
 
 
}
